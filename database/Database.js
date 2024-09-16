const mysql = require("mysql2/promise");
const selectQueryBuilder = require("./utils/selectQueryBuilder");
const InsertQueryBuilder = require("./utils/insertQueryBuilder");

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

    async createTable(tableName, tableArgs) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }

        let columns = "";
        let primaryKey = null;
        const typeMapping = {
            string: 'VARCHAR(255)',
            number: 'INT',
            boolean: 'TINYINT(1)',
            date: 'DATETIME',
        };

        for (let [key, value] of Object.entries(tableArgs)) {
            let columnDef = `${key} `;

            // Check if primary key is specified
            if (value.primaryKey) {
                columnDef += typeMapping[value.type] + " PRIMARY KEY";
                if (value.autoIncrement && value.type === 'number') {
                    columnDef += " AUTO_INCREMENT";
                }
                primaryKey = key;
            } else {
                columnDef += typeMapping[value.type];
            }

            columns += `${columnDef}, `;
        }

        // Remove the trailing comma and space
        columns = columns.slice(0, -2);

        try {
            const sql = `CREATE TABLE ${tableName} (${columns})`;
            const [result] = await this.connection.query(sql);
            console.log(`Table ${tableName} created successfully.`);
            return result;
        } catch (err) {
            console.error(`ERROR CREATING TABLE ${tableName}:`, err);
        }
    };

    async deleteTable(tableName) {
        if(!this.connection) {
            throw new Error("Database connection not established.");
        }

        try {
            const sql = `DROP TABLE ${tableName}`;
            const [result] = await this.connection.query(sql);
            console.log(`Table ${tableName} Dropped successfully`);
            return result;

        } catch (err) {
            console.error(`ERROR DROPPING TABLE ${tableName}`);
        }
    };

    insert(tableName) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }
        return new InsertQueryBuilder(this, tableName);
    }

    select(tableName) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }

        // Return an instance of QueryBuilder
        return new selectQueryBuilder(this, tableName);
    }
}


module.exports = Database;