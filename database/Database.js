const mysql = require("mysql2/promise");
const Table = require("./Table.js");
const CreateTableBuilder = require("./utils/schemaOperations/createTableBuilder.js");
const DeleteTableBuilder = require("./utils/schemaOperations/deleteTableBuilder.js");

class Database {
    /**
     * Creates a new Database instance.
     * @param {string} host - The hostname of the MySQL server.
     * @param {string} user - The username for the database connection.
     * @param {string} password - The password for the database connection.
     * @param {string} database - The name of the database to connect to.
     * @param {number} [port=3306] - The port number to connect to (default is 3306).
     */
    constructor(host, user, password, database, port = 3306) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.port = port;
        this.connection = null;
    }

    /**
     * Establishes a connection to the database.
     * @returns {Promise<object|null>} - The database connection object or null if connection fails.
     * @throws {Error} If the connection fails.
     */
    async connect() {
        try {
            this.connection = await mysql.createConnection(
                `mysql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`
            );
            console.log("Database connected successfully");
            return this.connection;
        } catch (err) {
            console.error("Error connecting to the database:", err);
            return null;
        }
    }

    /**
     * Disconnects from the database if a connection exists.
     * @returns {Promise<void>} - Resolves when the connection is successfully closed.
     */
    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.end();
                console.log("Database disconnected successfully");
            } catch (err) {
                console.error("Error disconnecting from the database:", err);
            } finally {
                this.connection = null;
            }
        } else {
            console.warn("No active database connection to disconnect.");
        }
    }

    /**
     * Creates a new table in the database.
     * @param {string} tableName - The name of the table to create.
     * @param {object} tableArgs - An object defining the table columns and their properties.
     * @returns {Promise<void>}
     * @throws {Error} If the database connection is not established or if table creation fails.
     */
    async createTable(tableName, tableArgs) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }

        const createTableBuilder = new CreateTableBuilder(this.connection, tableName, tableArgs);
        await createTableBuilder.create();
    }

    /**
     * Deletes a table from the database.
     * @param {string} tableName - The name of the table to delete.
     * @returns {Promise<void>}
     * @throws {Error} If the database connection is not established or if table deletion fails.
     */
    async deleteTable(tableName) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }

        const deleteTableBuilder = new DeleteTableBuilder(this.connection, tableName);
        await deleteTableBuilder.delete();
    }

    /**
     * Returns a Table instance for performing operations on a specific table.
     * @param {string} tableName - The name of the table to interact with.
     * @returns {Table} - An instance of the Table class to perform CRUD operations.
     */
    table(tableName) {
        return new Table(this, tableName);
    }
}

module.exports = Database;
