class QueryBuilder {
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

    columns(...columns) {
        this.columnsList = columns.length > 0 ? columns.join(", ") : "*";
        return this; // Return `this` to allow chaining
    }

    max(column) {
        this.aggregateFunctions.push(`MAX(${column}) AS max_${column}`);
        return this;
    }

    min(column) {
        this.aggregateFunctions.push(`MIN(${column}) AS min_${column}`);
        return this;
    }

    avg(column) {
        this.aggregateFunctions.push(`AVG(${column}) AS avg_${column}`);
        return this;
    }

    where(condition, parameter) {
        this.whereClause = ` WHERE ${condition}`;
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this; // Return `this` to allow chaining
    }

    and(condition, parameter) {
        if (this.whereClause === "") {
            this.whereClause = ` WHERE ${condition}`;
        } else {
            this.additionalConditions.push(`AND ${condition}`);
        }
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this; // Return `this` to allow chaining
    }

    or(condition, parameter) {
        if (this.whereClause === "") {
            this.whereClause = ` WHERE ${condition}`;
        } else {
            this.additionalConditions.push(`OR ${condition}`);
        }
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this; // Return `this` to allow chaining
    }

    orderBy(condition) {
        this.orderby = `ORDER BY ${condition}`;
        return this;
    }

    limit(number) {
        if (number) {
            this.limitParam = `LIMIT ${number}`;
            return this;
        }
    }

    groupBy(columnName) {
        if (columnName) {
            this.groupByParam = `GROUP BY ${columnName}`;
            return this;
        }
    }

    async execute() {
        let columns = this.columnsList;
        
        // If aggregate functions exist, use them instead of the regular columns
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