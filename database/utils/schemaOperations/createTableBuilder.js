class CreateTableBuilder {
    constructor(connection, tableName, tableArgs) {
        this.tableName = tableName;
        this.tableArgs = tableArgs;
        this.connection = connection; 
    }

    async create() {
        let columns = "";
        let primaryKey = null;
        const typeMapping = {
            string: 'VARCHAR(255)',
            number: 'INT',
            boolean: 'TINYINT(1)',
            date: 'DATETIME',
        };
    
        for (let [key, value] of Object.entries(this.tableArgs)) {
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
            const sql = `CREATE TABLE ${this.tableName} (${columns})`;
            const [result] = await this.connection.query(sql);
            console.log(`Table ${this.tableName} created successfully.`);
            return result;
        } catch (err) {
            console.error(`ERROR CREATING TABLE ${this.tableName}:`, err);
        }
    }

}

module.exports = CreateTableBuilder;