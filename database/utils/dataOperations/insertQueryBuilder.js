class InsertQueryBuilder {
    /**
     * InsertQueryBuilder class facilitates the construction and execution of
     * INSERT SQL queries with specified records.
     *
     * @param {object} db - The database instance to interact with.
     * @param {string} tableName - The name of the table where records will be inserted.
     */
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.columns = [];
        this.values = [];
    }

    /**
     * Specifies the records to be inserted into the table. Accepts either
     * a single object or an array of objects.
     *
     * @param {object|Array<object>} data - The record(s) to be inserted, where each
     * object represents a row with key-value pairs as column names and their values.
     * @returns {InsertQueryBuilder} Returns the instance of the query builder for chaining.
     * @throws {Error} If the data array is empty.
     * 
     * @example
     * const query = new InsertQueryBuilder(db, "users");
     * query.records({name: "John", age: 25}).execute();
     * 
     * @example
     * const query = new InsertQueryBuilder(db, "users");
     * query.records([{name: "John", age: 25}, {name: "Jane", age: 30}]).execute();
     */
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

    /**
     * Executes the INSERT query to insert the specified records into the table.
     * Each record will be inserted individually.
     * 
     * @returns {Promise<void>} Resolves if the query executes successfully.
     * @throws {Error} If the database connection is not established or no records are provided for insertion.
     * 
     * @example
     * const query = new InsertQueryBuilder(db, "users");
     * query.records([{name: "John", age: 25}, {name: "Jane", age: 30}]).execute();
     */
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
