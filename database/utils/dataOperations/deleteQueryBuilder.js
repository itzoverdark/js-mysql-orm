class DeleteQueryBuilder {
    /**
     * DeleteQueryBuilder class facilitates the construction and execution of
     * DELETE SQL queries with WHERE conditions.
     *
     * @param {object} db - The database instance to interact with.
     * @param {string} tableName - The name of the table from which records will be deleted.
     */
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.whereClause = "";
        this.additionalConditions = [];
        this.parameters = [];
    }

    /**
     * Specifies the WHERE condition for the DELETE query.
     * 
     * @param {string} condition - The condition for the WHERE clause (e.g., "id = ?").
     * @param {any} [parameter] - The parameter to be used in the condition (optional).
     * @returns {DeleteQueryBuilder} Returns the instance of the query builder for chaining.
     * 
     * @example
     * const query = new DeleteQueryBuilder(db, "users");
     * query.where("id = ?", 1).execute();
     */
    where(condition, parameter) {
        this.whereClause = ` WHERE ${condition}`;
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this;
    }

    /**
     * Adds an AND condition to the WHERE clause of the DELETE query.
     * 
     * @param {string} condition - The condition for the AND clause (e.g., "age > ?").
     * @param {any} [parameter] - The parameter to be used in the condition (optional).
     * @returns {DeleteQueryBuilder} Returns the instance of the query builder for chaining.
     * 
     * @example
     * const query = new DeleteQueryBuilder(db, "users");
     * query.where("status = ?", "active").and("age > ?", 18).execute();
     */
    and(condition, parameter) {
        if (this.whereClause === "") {
            this.whereClause = ` WHERE ${condition}`;
        } else {
            this.additionalConditions.push(`AND ${condition}`);
        }
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this;
    }

    /**
     * Adds an OR condition to the WHERE clause of the DELETE query.
     * 
     * @param {string} condition - The condition for the OR clause (e.g., "role = ?").
     * @param {any} [parameter] - The parameter to be used in the condition (optional).
     * @returns {DeleteQueryBuilder} Returns the instance of the query builder for chaining.
     * 
     * @example
     * const query = new DeleteQueryBuilder(db, "users");
     * query.where("status = ?", "inactive").or("role = ?", "guest").execute();
     */
    or(condition, parameter) {
        if (this.whereClause === "") {
            this.whereClause = ` WHERE ${condition}`;
        } else {
            this.additionalConditions.push(`OR ${condition}`);
        }
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this;
    }

    /**
     * Executes the DELETE query with the specified conditions.
     * 
     * @returns {Promise<object>} The result of the query execution.
     * @throws {Error} If the query execution fails.
     * 
     * @example
     * const query = new DeleteQueryBuilder(db, "users");
     * query.where("id = ?", 1).execute()
     *      .then(result => console.log("Rows affected:", result.affectedRows));
     */
    async execute() {
        const fullQuery = `DELETE FROM ${this.tableName}${this.whereClause} ${this.additionalConditions.join(" ")}`;
        try {
            const [result] = await this.db.connection.query(fullQuery, this.parameters);
            console.log("Rows affected:", result.affectedRows);
            return result;
        } catch (err) {
            console.error("Error executing query:", err);
            throw err;
        }
    }
}

module.exports = DeleteQueryBuilder;
