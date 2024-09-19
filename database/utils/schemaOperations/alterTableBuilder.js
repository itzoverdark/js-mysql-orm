class AlterTableBuilder {
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
