class CreateTableBuilder {
    constructor(connection, tableName, tableArgs) {
        this.tableName = tableName;
        this.tableArgs = tableArgs;
        this.connection = connection; 
    }

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
    
            columns += `${columnDef}, `;

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
