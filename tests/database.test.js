const Database = require("../database/Database.js");

async function runTests() {
    const db = new Database(
        "127.0.0.1", //host
        "root", //user
        "ishaq", //password
        "customorm", //database
        3306, //port
    );

    console.log("Test 1 : DATABASE CONNECTION");

    try {
        const connection = await db.connect();
        if (connection) {
            console.log('PASS: Database connected successfully');
        } else {
            console.log('FAIL: Database connection failed');
        }
    } catch (err) {
        console.log("DATABASE CONNECTION ERROR : ", err);
    }

    console.log("Test 2 : TABLE CREATION");

    
    await db.createTable("users", {
        name: "string",
        age : "number"
    });

    console.log("PASS: TABLE created successfully");


    console.log("Test 3 : INSERT INTO TABLE");

    try {
        await db
            .insert("users")
            .records({ name: "Ishaq", age: 18 })
            .execute();

        // Inserting multiple records
        await db
            .insert("users")
            .records([{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Ishaq", age: 21 }])
            .execute();

        console.log('PASS: INSERTED VALUES INTO TABLE SUCCESSFULLY');
    } catch (err) {
        console.log('FAIL: ERROR INSERTING VALUES INTO TABLE : ', err);
    }
    
    
    console.log("Test 4: SELECT FROM TABLE");

    try {
        // Test 1: Select all columns from the "users" table
        const allUsers = await db.select("users").execute();
        if (Array.isArray(allUsers)) {
            console.log("PASS: SELECTED ALL COLUMNS FROM TABLE SUCCESSFULLY");
        } else {
            console.log("FAIL: ERROR SELECTING ALL COLUMNS FROM TABLE");
        }
    
        // Test 2: Select specific columns "name" and "age" from the "users" table
        const userData = await db
            .select("users")
            .columns("name", "age")
            .where("age > 18")
            .execute();
        
        if (Array.isArray(userData) && userData.length > 0) {
            console.log("PASS: SELECTED NAME AND AGE FROM USERS WHERE AGE > 18 SUCCESSFULLY");
        } else {
            console.log("FAIL: ERROR SELECTING SPECIFIC COLUMNS OR NO DATA FOUND");
        }
    
        // Test 3: Select with multiple conditions
        const filteredData = await db
            .select("users")
            .columns("name", "age")
            .where("age > 18")
            .and("name = 'Ishaq'")
            .execute();
    
        if (Array.isArray(filteredData) && filteredData.length > 0) {
            console.log("PASS: SELECTED USERS WITH AGE > 18 AND NAME = 'Ishaq' SUCCESSFULLY");
        } else {
            console.log("FAIL: ERROR SELECTING USERS WITH CONDITIONS OR NO DATA FOUND");
        }
    
    } catch (err) {
        console.log("FAIL: ERROR SELECTING FROM TABLE", err);
    }

    

}

runTests();