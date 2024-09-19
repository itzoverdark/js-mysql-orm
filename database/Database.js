const mysql = require("mysql2/promise");
const Table = require("./Table.js");
const CreateTableBuilder = require("./utils/schemaOperations/createTableBuilder.js");
const DeleteTableBuilder = require("./utils/schemaOperations/deleteTableBuilder.js");

class Database {
    constructor(host, user, password, database, port) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.port = port;
        this.connection = null;
    }
    async connect() {
        try {
            this.connection = await mysql.createConnection(
                `mysql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`
            );
            console.log("Database connected successfully");
            return this.connection;
        } catch (err) {
            return null;
        }
    };

    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.end();  // Close the connection
                console.log("Database disconnected successfully");
            } catch (err) {
                console.error("Error disconnecting from the database:", err);
            } finally {
                this.connection = null;  // Set connection to null after disconnect
            }
        } else {
            console.warn("No active database connection to disconnect.");
        }
    }

    async createTable(tableName, tableArgs) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }

        const createTableBuilder = new CreateTableBuilder(this.connection, tableName, tableArgs);
        createTableBuilder.create();
    };

    async deleteTable(tableName) {
        if(!this.connection) {
            throw new Error("Database connection not established.");
        }

        const deleteTableBuilder = new DeleteTableBuilder(this.connection, tableName);
        deleteTableBuilder.delete();
    };

    table(tableName) {
        return new Table(this, tableName);
    }
}


module.exports = Database;