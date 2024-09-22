class DeleteTableBuilder {
    /**
     * DeleteTableBuilder is used to delete an existing table from the database.
     * @param {object} connection - The active MySQL connection object.
     * @param {string} tableName - The name of the table to delete.
     */
    constructor(connection, tableName) {
        this.tableName = tableName;
        this.connection = connection;
    }

    /**
     * Deletes the table from the database.
     * 
     * Executes a `DROP TABLE` SQL command to remove the table from the database.
     * 
     * @returns {Promise<object>} - The result of the SQL query after the table is deleted.
     * @throws {Error} If the table deletion fails.
     * 
     * @example
     * const deleteTableBuilder = new DeleteTableBuilder(connection, "users");
     * await deleteTableBuilder.delete();
     */
    async delete() {
        try {
            const sql = `DROP TABLE ${this.tableName}`;
            const [result] = await this.connection.query(sql);
            console.log(`Table ${this.tableName} dropped successfully.`);
            return result;

        } catch (err) {
            console.error(`ERROR DROPPING TABLE ${this.tableName}:`, err);
            throw err;  // Ensure the error is thrown so it can be handled by the caller
        }
    }
}

module.exports = DeleteTableBuilder;
