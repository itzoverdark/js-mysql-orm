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


    console.log("Test 3 : TABLE DROPPING");

    try {
        await db.deleteTable("users");
+       console.log("PASS: TABLE DROPPED SUCCESSFULLY");
    } catch (err) {
+       console.log("FAIL: ERROR DROPPING TABLE users");
    }

    console.log("Test 3 : INSERT INTO TABLE");

    try {
        // Insert a single record into the table
        await db.insert('User', {
            name: 'Ishaq',
            age: 18,
            active: 1
        });
    
        // Insert multiple records into the table
        await db.insert('User', [
            { name: 'Alice', age: 25, active: 1 },
            { name: 'Bob', age: 30, active: 0 }
        ]);

        console.log('PASS: INSERTED VALUES INTO TABLE SUCCESSFULLY');
    } catch (err) {
        console.log('FAIL: ERROR INSERTING VALUES INTO TABLE : ', err);
    }
}

runTests();