const Database = require("../database/Database.js");

let db;
let connection;

describe("Database Tests", () => {

    // Initialize the database connection before all tests
    beforeAll(async () => {
        db = new Database(
            "127.0.0.1", // host
            "root", // user
            "ishaq", // password
            "customorm", // database
            3306, // port
        );
        await db.connect();
        connection = db.connection;
    });

    // Close the database connection after all tests
    afterAll(async () => {
        await db.disconnect();
    });

    test("1. Database should connect successfully", async () => {
        expect(connection).toBeTruthy();
    });

    test("2. Should create 'users' table", async () => {
        // First, ensure any existing 'users' table is dropped
        await connection.query("DROP TABLE IF EXISTS users");

        // Create the table using your ORM
        await db.createTable("users", {
            id: { type: "number", primaryKey: true, autoIncrement: true },
            name: { type: "string" },
            age: { type: "number" },
        });

        // Check if the 'users' table exists using raw SQL
        const [rows] = await connection.query(`
            SELECT COUNT(*) AS tableExists
            FROM information_schema.tables
            WHERE table_schema = '${db.database}'
            AND table_name = 'users';
        `);

        expect(rows[0].tableExists).toBe(1);
    });

    test("3. Should insert data into 'users' table", async () => {
        // Clear the table first
        await connection.query("DELETE FROM users");

        // Insert data using your ORM
        await db.table("users")
            .insert()
            .records({ name: "Ishaq", age: 18 })
            .execute();

        await db.table("users")
            .insert()
            .records([{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Ishaq", age: 21 }])
            .execute();

        // Verify the data insertion with raw SQL
        const [rows] = await connection.query("SELECT COUNT(*) AS count FROM users");
        expect(rows[0].count).toBeGreaterThan(0);
    });

    test("4. Should select data from 'users' table", async () => {
        // Clear the table first
        await connection.query("DELETE FROM users");

        // Insert some data using your ORM
        await db.table("users")
            .insert()
            .records([{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Ishaq", age: 21 }])
            .execute();

        // Verify the data selection with raw SQL
        const allUsers = await db.table("users").select().execute();
        expect(allUsers.length).toBe(3);

        const filteredUsers = await db.table("users").select().columns("name", "age").where("age > ?", 18).execute();
        expect(filteredUsers.length).toBeGreaterThan(0);
    });

    test("5. Should delete data from 'users' table", async () => {
        // Clear the table first
        await connection.query("DELETE FROM users");

        // Insert data to delete
        await db.table("users")
            .insert()
            .records([{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Ishaq", age: 21 }])
            .execute();

        // Delete records using your ORM
        const deleteResult = await db.table("users").delete().where("age > 18").execute();
        expect(deleteResult.affectedRows).toBeGreaterThan(0);
    });

    test("6. Should update data in 'users' table", async () => {
        // Clear the table first
        await connection.query("DELETE FROM users");

        // Insert data to update
        await db.table("users")
            .insert()
            .records([{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Ishaq", age: 18 }])
            .execute();

        // Update records using ORM
        await db.table("users")
            .update()
            .set({ age: 99 })
            .where("age = 18")
            .execute();

        // Verify the data update with raw SQL
        const [updatedUser] = await connection.query("SELECT * FROM users WHERE age = 99");
        expect(updatedUser.length).toBe(1);
    });
});
