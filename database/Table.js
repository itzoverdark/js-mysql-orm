const selectQueryBuilder = require("./utils/selectQueryBuilder");
const InsertQueryBuilder = require("./utils/insertQueryBuilder");
const DeleteQueryBuilder = require("./utils/deleteQueryBuilder");
const UpdateQueryBuilder = require("./utils/updateQueryBuilder");

class Table {
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }

    ensureConnection() {
        if (!this.db.connection) {
            throw new Error("Database connection not established.");
        }
    }

    insert() {
        this.ensureConnection();
        return new InsertQueryBuilder(this.db, this.tableName);
    }

    select() {
        this.ensureConnection();
        return new selectQueryBuilder(this.db, this.tableName);
    }

    delete() {
        this.ensureConnection();
        return new DeleteQueryBuilder(this.db, this.tableName);
    }

    update() {
        this.ensureConnection();
        return new UpdateQueryBuilder(this.db, this.tableName);
    }
}

module.exports = Table;