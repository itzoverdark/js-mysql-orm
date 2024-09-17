# Custom JavaScript ORM for MySQL

This is a lightweight custom Object-Relational Mapping (ORM) library written in JavaScript, designed to simplify interactions with MySQL databases. It allows you to create tables, insert, update, delete, and query records using a simple and chainable API.

## Features
- Easy MySQL connection setup
- Create and drop tables
- Insert, update, and delete records
- Query records with filtering options
- Chainable API for intuitive usage

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/itzoverdark/js-mysql-orm
   ```
2. Install the required dependencies:
   ```bash
   npm install mysql2
   ```

## Usage
### Connect to the Database
- Start by creating a connection to your MySQL database using the Database class.


```javascript
const Database = require("./path/to/Database.js");

const db = new Database(
    "127.0.0.1", // host
    "root",      // username
    "password",  // password
    "mydb",      // database name
    3306         // port
);

db.connect()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("Database connection error:", err));
```

### Creating a Table
- Use the createTable method to create a new table in the database.

```javascript
await db.createTable("users", {
    id: { type: "number", primaryKey: true, autoIncrement: true },
    name: { type: "string" },
    age: { type: "number" },
});
```

### Inserting Records
- Insert records using a chainable API.

```javascript
await db.table("users")
    .insert()
    .records({ name: "Ishaq", age: 18 })
    .execute();
```
- Insert multiple records:

```javascript
await db.table("users")
    .insert()
    .records([{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }])
    .execute();
```

### Querying Records
- Select all records from a table:

```javascript
const users = await db.table("users").select().execute();
```

- Select specific columns with filtering:

```javascript
const users = await db.table("users")
    .select()
    .columns("name", "age")
    .where("age > 18")
    .execute();
```

### Updating Records
- Update records in the table:

```javascript
await db.table("users")
    .update()
    .set({ age: 21 })
    .where("name = 'Ishaq'")
    .execute();
```

### Deleting Records
- Delete records based on conditions:

```javascript
await db.table("users")
    .delete()
    .where("age < 18")
    .execute();
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
### How to Customize

- Replace the placeholder link `https://github.com/itzoverdark/your-repo-name.git` with the actual link to your GitHub repository.
- Feel free to add any additional sections, such as tests, advanced features, or roadmap, if necessary.
