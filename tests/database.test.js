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


}

runTests();