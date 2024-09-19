class InsertQueryBuilder {
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.columns = [];
        this.values = [];
    }

    // Add records for insertion (either a single object or an array of objects)
    records(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length === 0) {
            throw new Error("Data array should not be empty.");
        }

        this.columns = Object.keys(data[0]); // Take column names from the first record
        this.values = data.map(record => Object.values(record));
        return this;
    }

    async execute() {
        if (!this.db.connection) {
            throw new Error("Database connection not established.");
        }

        if (this.values.length === 0) {
            throw new Error("No records to insert.");
        }

        const columnsString = this.columns.join(", ");
        const placeholders = this.values[0].map(() => "?").join(", ");
        const sql = `INSERT INTO ${this.tableName} (${columnsString}) VALUES (${placeholders})`;

        try {
            // Insert each record individually
            for (const record of this.values) {
                await this.db.connection.query(sql, record);
            }
            console.log(`Records inserted into ${this.tableName} successfully.`);
        } catch (err) {
            throw new Error(`Error inserting records into ${this.tableName}: ${err}`);
        }
    }
}

module.exports = InsertQueryBuilder;
