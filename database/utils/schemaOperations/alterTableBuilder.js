class AlterTableBuilder {
    /**
     * AlterTableBuilder class is used to perform schema modifications on a specific table in the database.
     * It allows adding, dropping, and modifying columns within the table.
     * 
     * @param {object} db - The Database instance to interact with.
     * @param {string} tableName - The name of the table to operate on.
     */
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.typeMapping = {
            string: 'VARCHAR(255)',
            number: 'INT',
            boolean: 'TINYINT(1)',
            date: 'DATETIME',
        };
    }

    /**
     * Adds a new column to the table.
     * 
     * @param {string} columnName - The name of the new column to be added.
     * @param {string} dataType - The data type of the new column (e.g., 'string', 'number', 'boolean', 'date').
     * @returns {Promise<void>} Resolves when the column is added successfully.
     * @throws {Error} If there is an issue executing the SQL query.
     * 
     * @example
     * const alterTable = new AlterTableBuilder(db, "users");
     * await alterTable.add_column("new_column", "string");
     */
    async add_column(columnName, dataType) {
        try {
            const sql = `ALTER TABLE ${this.tableName} ADD ${columnName} ${this.typeMapping[dataType]}`;
            const [result] = await this.db.connection.query(sql);
            console.log(`Column ${columnName} added successfully to ${this.tableName}.`);
            return result;
        } catch (err) {
            console.error(`ERROR ADDING COLUMN ${columnName} TO TABLE ${this.tableName}:`, err);
        }
    }

    /**
     * Drops a column from the table.
     * 
     * @param {string} columnName - The name of the column to be removed.
     * @returns {Promise<void>} Resolves when the column is dropped successfully.
     * @throws {Error} If there is an issue executing the SQL query.
     * 
     * @example
     * const alterTable = new AlterTableBuilder(db, "users");
     * await alterTable.drop_column("old_column");
     */
    async drop_column(columnName) {
        try {
            const sql = `ALTER TABLE ${this.tableName} DROP COLUMN ${columnName}`;
            const [result] = await this.db.connection.query(sql);
            console.log(`Column ${columnName} dropped successfully from ${this.tableName}.`);
            return result;
        } catch (err) {
            console.error(`ERROR DROPPING COLUMN ${columnName} FROM TABLE ${this.tableName}:`, err);
        }
    }

    /**
     * Modifies an existing column in the table.
     * 
     * @param {string} columnName - The name of the column to modify.
     * @param {string} dataType - The new data type of the column (e.g., 'string', 'number', 'boolean', 'date').
     * @returns {Promise<void>} Resolves when the column is modified successfully.
     * @throws {Error} If there is an issue executing the SQL query.
     * 
     * @example
     * const alterTable = new AlterTableBuilder(db, "users");
     * await alterTable.modify_column("age", "number");
     */
    async modify_column(columnName, dataType) {
        try {
            const sql = `ALTER TABLE ${this.tableName} MODIFY COLUMN ${columnName} ${this.typeMapping[dataType]}`;
            const [result] = await this.db.connection.query(sql);
            console.log(`Column ${columnName} modified successfully in ${this.tableName}.`);
            return result;
        } catch (err) {
            console.error(`ERROR MODIFYING COLUMN ${columnName} IN TABLE ${this.tableName}:`, err);
        }
    }
}

module.exports = AlterTableBuilder;
