class DeleteTableBuilder {
    constructor(connection, tableName) {
        this.tableName = tableName;
        this.connection = connection;
    }

    async delete() {
        try {
            const sql = `DROP TABLE ${this.tableName}`;
            const [result] = await this.connection.query(sql);
            console.log(`Table ${this.tableName} Dropped successfully`);
            return result;

        } catch (err) {
            console.error(`ERROR DROPPING TABLE ${this.tableName}`);
        }
    }
}

module.exports = DeleteTableBuilder;