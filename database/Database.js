const mysql = require("mysql2/promise");

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
        const typeMapping = {
            string: 'VARCHAR(255)',
            number: 'INT',
            boolean: 'TINYINT(1)',
            date: 'DATETIME',
        };

        for (let [key, value] of Object.entries(tableArgs)) {
            // get the equivalent type in mysql
            const mysqlType = typeMapping[value];

            if (!mysqlType) {
                console.error(`Unsupported type: ${value}`);
                continue;
            }
            columns += `${key} ${mysqlType}, `
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

    async insert(tableName, data) {
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }

        // Ensure data is an array
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length === 0) {
            throw new Error("Data array should not be empty.");
        }

        const columns = Object.keys(data[0]).join(", ");
        const values = data.map(record => Object.values(record));
        const placeholders = values[0].map(() => '?').join(", ");
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

        try {
            for (const record of data) {
                await this.connection.query(sql, Object.values(record));
                console.log(`Record inserted into ${tableName} successfully.`);
            }
        } catch (err) {
            console.error(`ERROR INSERTING RECORD INTO ${tableName}:`, err);
        }
    };
    
}

module.exports = Database;