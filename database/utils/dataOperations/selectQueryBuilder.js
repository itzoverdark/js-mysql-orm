class QueryBuilder {
    /**
     * QueryBuilder class for constructing and executing SQL SELECT queries.
     *
     * @param {object} db - The database instance to execute queries against.
     * @param {string} tableName - The name of the table from which data will be selected.
     */
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.columnsList = "*"; // Default to all columns
        this.whereClause = "";
        this.additionalConditions = [];
        this.parameters = [];
        this.orderby = "";
        this.limitParam = "";
        this.groupByParam = "";
        this.aggregateFunctions = []; // To store aggregate functions like MAX, MIN, AVG
    }

    /**
     * Specifies the columns to be selected.
     *
     * @param {...string} columns - The columns to include in the SELECT query.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.columns("id", "name").execute();
     */
    columns(...columns) {
        this.columnsList = columns.length > 0 ? columns.join(", ") : "*";
        return this;
    }

    /**
     * Adds a MAX aggregate function for a specified column.
     *
     * @param {string} column - The column to apply the MAX function on.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.max("age").execute();
     */
    max(column) {
        this.aggregateFunctions.push(`MAX(${column}) AS max_${column}`);
        return this;
    }

    /**
     * Adds a MIN aggregate function for a specified column.
     *
     * @param {string} column - The column to apply the MIN function on.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.min("age").execute();
     */
    min(column) {
        this.aggregateFunctions.push(`MIN(${column}) AS min_${column}`);
        return this;
    }

    /**
     * Adds an AVG aggregate function for a specified column.
     *
     * @param {string} column - The column to apply the AVG function on.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.avg("salary").execute();
     */
    avg(column) {
        this.aggregateFunctions.push(`AVG(${column}) AS avg_${column}`);
        return this;
    }

    /**
     * Adds a WHERE condition to the query.
     *
     * @param {string} condition - The condition for the WHERE clause.
     * @param {*} [parameter] - Optional parameter to be used with the condition.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
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
     * Adds an AND condition to the WHERE clause.
     *
     * @param {string} condition - The condition for the AND clause.
     * @param {*} [parameter] - Optional parameter to be used with the condition.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.where("age > ?", 18).and("name = ?", "John").execute();
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
     * Adds an OR condition to the WHERE clause.
     *
     * @param {string} condition - The condition for the OR clause.
     * @param {*} [parameter] - Optional parameter to be used with the condition.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.where("age > ?", 18).or("name = ?", "John").execute();
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
     * Adds an ORDER BY clause to the query.
     *
     * @param {string} condition - The condition for ordering results.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.orderBy("name ASC").execute();
     */
    orderBy(condition) {
        this.orderby = `ORDER BY ${condition}`;
        return this;
    }

    /**
     * Limits the number of results in the query.
     *
     * @param {number} number - The number of results to limit.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.limit(10).execute();
     */
    limit(number) {
        if (number) {
            this.limitParam = `LIMIT ${number}`;
            return this;
        }
    }

    /**
     * Adds a GROUP BY clause to the query.
     *
     * @param {string} columnName - The column name for grouping results.
     * @returns {QueryBuilder} Returns the current instance for method chaining.
     *
     * @example
     * const query = new QueryBuilder(db, "orders");
     * query.groupBy("customer_id").execute();
     */
    groupBy(columnName) {
        if (columnName) {
            this.groupByParam = `GROUP BY ${columnName}`;
            return this;
        }
    }

    /**
     * Executes the constructed query and returns the result set.
     *
     * @returns {Promise<Array>} The result set from the database.
     * @throws {Error} If there's an issue with executing the query.
     *
     * @example
     * const query = new QueryBuilder(db, "users");
     * query.where("age > ?", 18).execute().then(rows => console.log(rows));
     */
    async execute() {
        let columns = this.columnsList;
        
        // If aggregate functions exist, use them instead of regular columns
        if (this.aggregateFunctions.length > 0) {
            columns = this.aggregateFunctions.join(", ");
        }

        const fullQuery = `SELECT ${columns} FROM ${this.tableName} ${this.whereClause} ${this.additionalConditions.join(" ")} ${this.groupByParam} ${this.orderby} ${this.limitParam}`;
        
        try {
            const [rows] = await this.db.connection.query(fullQuery, this.parameters);
            console.log(rows);
            return rows;
        } catch (err) {
            console.error("Error executing query:", err);
            throw err;
        }
    }
}

module.exports = QueryBuilder;
