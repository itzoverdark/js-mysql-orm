const selectQueryBuilder = require("./utils/dataOperations/selectQueryBuilder");
const InsertQueryBuilder = require("./utils/dataOperations/insertQueryBuilder");
const DeleteQueryBuilder = require("./utils/dataOperations/deleteQueryBuilder");
const UpdateQueryBuilder = require("./utils/dataOperations/updateQueryBuilder");
const AlterTableBuilder = require("./utils/schemaOperations/alterTableBuilder");

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

    //operations on data inside tables

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

    // operations on the table

    async add_column(columnName, dataType) {
        this.ensureConnection();
        const alterTableBuilder = new AlterTableBuilder(this.db, this.tableName);  // Pass db and tableName
        await alterTableBuilder.add_column(columnName, dataType);
    }

    async drop_column(columnName) {
        this.ensureConnection();
        const alterTableBuilder = new AlterTableBuilder(this.db, this.tableName);
        await alterTableBuilder.drop_column(columnName);
    }

    async modify_column(columnName, dataType) {
        this.ensureConnection();
        const alterTableBuilder = new AlterTableBuilder(this.db, this.tableName);
        await alterTableBuilder.modify_column(columnName, dataType);
    }

}

module.exports = Table;