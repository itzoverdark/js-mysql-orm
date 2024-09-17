class UpdateQueryBuilder {
    constructor(db, tableName) {
        this.db = db; // The database instance
        this.tableName = tableName; // The table being updated
        this.setClause = []; // Array to hold column-value pairs for the SET clause
        this.whereClause = ""; // Optional WHERE clause to filter rows
    }

    // Method to set values to update
    set(values) {
        for (let [column, value] of Object.entries(values)) {
            this.setClause.push(`${column} = ${this.db.connection.escape(value)}`);
        }
        return this; // Return the builder to allow method chaining
    }

    // Method to define the WHERE clause
    where(condition) {
        this.whereClause = `WHERE ${condition}`;
        return this;
    }

    // Method to add an AND condition to the WHERE clause
    and(condition) {
        if (this.whereClause) {
            this.whereClause += ` AND ${condition}`;
        } else {
            this.whereClause = `WHERE ${condition}`;
        }
        return this;
    }

    // Method to execute the query
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
