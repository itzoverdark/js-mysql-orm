class UpdateQueryBuilder {
    /**
     * UpdateQueryBuilder class for constructing and executing SQL UPDATE queries.
     *
     * @param {object} db - The database instance to execute queries against.
     * @param {string} tableName - The name of the table to update.
     */
    constructor(db, tableName) {
        this.db = db; // The database instance
        this.tableName = tableName; // The table being updated
        this.setClause = []; // Array to hold column-value pairs for the SET clause
        this.whereClause = ""; // Optional WHERE clause to filter rows
    }

    /**
     * Sets the columns and values to be updated.
     *
     * @param {object} values - An object where the keys are column names and the values are the new values.
     * @returns {UpdateQueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new UpdateQueryBuilder(db, "users");
     * query.set({ name: "John", age: 30 }).execute();
     */
    set(values) {
        for (let [column, value] of Object.entries(values)) {
            this.setClause.push(`${column} = ${this.db.connection.escape(value)}`);
        }
        return this; // Return the builder to allow method chaining
    }

    /**
     * Adds a WHERE condition to the query to specify which rows to update.
     *
     * @param {string} condition - The condition for the WHERE clause.
     * @returns {UpdateQueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new UpdateQueryBuilder(db, "users");
     * query.set({ name: "John" }).where("id = 1").execute();
     */
    where(condition) {
        this.whereClause = `WHERE ${condition}`;
        return this;
    }

    /**
     * Adds an AND condition to the existing WHERE clause.
     *
     * @param {string} condition - The condition to add with AND.
     * @returns {UpdateQueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new UpdateQueryBuilder(db, "users");
     * query.set({ age: 30 }).where("name = 'John'").and("status = 'active'").execute();
     */
    and(condition) {
        if (this.whereClause) {
            this.whereClause += ` AND ${condition}`;
        } else {
            this.whereClause = `WHERE ${condition}`;
        }
        return this;
    }

    /**
     * Executes the constructed UPDATE query.
     *
     * @returns {Promise<object>} Returns the result object from the database, including affected rows.
     * @throws {Error} If no columns have been set for the update.
     *
     * @example
     * const query = new UpdateQueryBuilder(db, "users");
     * query.set({ age: 30 }).where("name = 'John'").execute()
     *     .then(result => console.log(`Updated ${result.affectedRows} rows`));
     */
    async execute() {
        if (!this.setClause.length) {
            throw new Error("No columns have been set for update.");
        }

        const setClauseStr = this.setClause.join(", ");
        const sql = `UPDATE ${this.tableName} SET ${setClauseStr} ${this.whereClause}`;

        try {
            const [result] = await this.db.connection.query(sql);
            console.log(`Updated ${result.affectedRows} rows in table ${this.tableName}`);
            return result;
        } catch (err) {
            console.error(`ERROR UPDATING TABLE ${this.tableName}:`, err);
            throw err;
        }
    }
}

module.exports = UpdateQueryBuilder;
