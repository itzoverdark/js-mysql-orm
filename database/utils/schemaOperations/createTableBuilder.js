class CreateTableBuilder {
    /**
     * CreateTableBuilder is used to create a new table in the database.
     * @param {object} connection - The active MySQL connection object.
     * @param {string} tableName - The name of the table to create.
     * @param {object} tableArgs - An object describing the table columns and their properties.
     * Example format: 
     * {
     *   columnName: { type: 'string', primaryKey: true, autoIncrement: true, notNull: true, foreignKey: { references: 'anotherTable', referencedColumn: 'id' } }
     * }
     */
    constructor(connection, tableName, tableArgs) {
        this.tableName = tableName;
        this.tableArgs = tableArgs;
        this.connection = connection; 
    }

    /**
     * Creates the table in the database using the provided arguments.
     * 
     * - Column types are mapped to SQL types: `string` -> `VARCHAR(255)`, `number` -> `INT`, `boolean` -> `TINYINT(1)`, `date` -> `DATETIME`.
     * - Primary key and foreign key constraints can be specified in `tableArgs`.
     * - The `notNull` property ensures that the column is defined as `NOT NULL`.
     * 
     * @returns {Promise<object>} - The result of the SQL query after table creation.
     * @throws {Error} If the table creation fails.
     * 
     * @example
     * const tableArgs = {
     *   id: { type: 'number', primaryKey: true, autoIncrement: true },
     *   name: { type: 'string', notNull: true },
     *   age: { type: 'number' },
     *   isActive: { type: 'boolean' },
     *   friendId: { type: 'number', foreignKey: { references: 'friends', referencedColumn: 'id' } }
     * };
     * 
     * const tableBuilder = new CreateTableBuilder(connection, "users", tableArgs);
     * await tableBuilder.create();
     */
    async create() {
        let columns = "";
        let primaryKey = null;
        let foreignKeys = []; // To store foreign key constraints
        const typeMapping = {
            string: 'VARCHAR(255)',
            number: 'INT',
            boolean: 'TINYINT(1)',
            date: 'DATETIME',
        };
    
        for (let [key, value] of Object.entries(this.tableArgs)) {
            let columnDef = `${key} `;
    
            // Check if primary key is specified
            if (value.primaryKey) {
                columnDef += typeMapping[value.type] + " PRIMARY KEY";
                if (value.autoIncrement && value.type === 'number') {
                    columnDef += " AUTO_INCREMENT";
                }
                primaryKey = key;
            } else {
                columnDef += typeMapping[value.type];
            }
    
            // Add NOT NULL constraint if specified
            if (value.notNull) {
                columnDef += " NOT NULL";
            }

            columns += `${columnDef}, `;

            // Check if the column has a foreign key constraint
            if (value.foreignKey) {
                const { references, referencedColumn } = value.foreignKey;
                foreignKeys.push(`FOREIGN KEY (${key}) REFERENCES ${references}(${referencedColumn})`);
            }
        }
    
        // Remove the trailing comma and space from the column definition
        columns = columns.slice(0, -2);
    
        // Append foreign key constraints, if any
        if (foreignKeys.length > 0) {
            columns += `, ${foreignKeys.join(', ')}`;
        }
    
        try {
            const sql = `CREATE TABLE ${this.tableName} (${columns})`;
            const [result] = await this.connection.query(sql);
            console.log(`Table ${this.tableName} created successfully.`);
            return result;
        } catch (err) {
            if (err.code === 'ER_NO_REFERENCED_TABLE' || err.code === 'ER_NO_REFERENCED_TABLE2') {
                console.error('Referenced table or column does not exist.');
            } else {
                console.error(`ERROR CREATING TABLE ${this.tableName}:`, err);
            }
            throw err;
        }
    }
}

module.exports = CreateTableBuilder;
