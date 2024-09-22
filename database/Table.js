const selectQueryBuilder = require("./utils/dataOperations/selectQueryBuilder");
const InsertQueryBuilder = require("./utils/dataOperations/insertQueryBuilder");
const DeleteQueryBuilder = require("./utils/dataOperations/deleteQueryBuilder");
const UpdateQueryBuilder = require("./utils/dataOperations/updateQueryBuilder");
const AlterTableBuilder = require("./utils/schemaOperations/alterTableBuilder");

class Table {
    /**
     * Table class is used to interact with a specific table in the database. 
     * It allows performing data operations (CRUD) and schema operations (altering tables).
     * 
     * @param {object} db - The Database instance to interact with.
     * @param {string} tableName - The name of the table to operate on.
     */
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }

    /**
     * Ensures that a database connection is established before performing operations.
     * @throws {Error} If no active database connection is found.
     * 
     * @private
     */
    ensureConnection() {
        if (!this.db.connection) {
            throw new Error("Database connection not established.");
        }
    }

    // Data Operations

    /**
     * Initiates an insert operation to add records into the table.
     * 
     * @returns {InsertQueryBuilder} An instance of InsertQueryBuilder to handle the insertion logic.
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * usersTable.insert().records([{ name: "Alice", age: 30 }]).execute();
     */
    insert() {
        this.ensureConnection();
        return new InsertQueryBuilder(this.db, this.tableName);
    }

    /**
     * Initiates a select operation to retrieve data from the table.
     * 
     * @returns {selectQueryBuilder} An instance of selectQueryBuilder to handle data selection.
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * const result = await usersTable.select().columns("name", "age").execute();
     */
    select() {
        this.ensureConnection();
        return new selectQueryBuilder(this.db, this.tableName);
    }

    /**
     * Initiates a delete operation to remove data from the table.
     * 
     * @returns {DeleteQueryBuilder} An instance of DeleteQueryBuilder to handle deletion logic.
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * usersTable.delete().where("age > ?", 30).execute();
     */
    delete() {
        this.ensureConnection();
        return new DeleteQueryBuilder(this.db, this.tableName);
    }

    /**
     * Initiates an update operation to modify existing data in the table.
     * 
     * @returns {UpdateQueryBuilder} An instance of UpdateQueryBuilder to handle update logic.
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * usersTable.update().set({ name: "Alice" }).where("id = ?", 1).execute();
     */
    update() {
        this.ensureConnection();
        return new UpdateQueryBuilder(this.db, this.tableName);
    }

    // Schema Operations

    /**
     * Adds a new column to the table.
     * 
     * @param {string} columnName - The name of the new column.
     * @param {string} dataType - The data type of the new column (e.g., 'VARCHAR(255)', 'INT').
     * @returns {Promise<void>}
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * await usersTable.add_column("new_column", "VARCHAR(255)");
     */
    async add_column(columnName, dataType) {
        this.ensureConnection();
        const alterTableBuilder = new AlterTableBuilder(this.db, this.tableName);
        await alterTableBuilder.add_column(columnName, dataType);
    }

    /**
     * Drops a column from the table.
     * 
     * @param {string} columnName - The name of the column to be removed.
     * @returns {Promise<void>}
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * await usersTable.drop_column("old_column");
     */
    async drop_column(columnName) {
        this.ensureConnection();
        const alterTableBuilder = new AlterTableBuilder(this.db, this.tableName);
        await alterTableBuilder.drop_column(columnName);
    }

    /**
     * Modifies an existing column in the table.
     * 
     * @param {string} columnName - The name of the column to modify.
     * @param {string} dataType - The new data type of the column (e.g., 'VARCHAR(255)', 'INT').
     * @returns {Promise<void>}
     * @throws {Error} If the database connection is not established.
     * 
     * @example
     * const usersTable = db.table("users");
     * await usersTable.modify_column("age", "INT");
     */
    async modify_column(columnName, dataType) {
        this.ensureConnection();
        const alterTableBuilder = new AlterTableBuilder(this.db, this.tableName);
        await alterTableBuilder.modify_column(columnName, dataType);
    }

}

module.exports = Table;
