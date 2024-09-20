class QueryBuilder {
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.columnsList = "*"; // Default to all columns
        this.whereClause = "";
        this.additionalConditions = [];
        this.parameters = [];
        this.orderby = "";
    }

    columns(...columns) {
        this.columnsList = columns.length > 0 ? columns.join(", ") : "*";
        return this; // Return `this` to allow chaining
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

    async execute() {
        const fullQuery = `SELECT ${this.columnsList} FROM ${this.tableName}${this.whereClause} ${this.additionalConditions.join(" ")} ${this.orderby}`;
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