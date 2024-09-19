class DeleteQueryBuilder {
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.whereClause = "";
        this.additionalConditions = [];
        this.parameters = [];
    }

    where(condition, parameter) {
        this.whereClause = ` WHERE ${condition}`;
        if (parameter !== undefined) {
            this.parameters.push(parameter);
        }
        return this;
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
        return this;
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
        return this;
    }

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
