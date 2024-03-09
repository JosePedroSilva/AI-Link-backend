const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT
        )`, (err) => {
            if (err) {
                console.error(err.message, 'Error creating the users table. Table may already exist.');
            }
        });
        console.log('Connected to the SQLite database.');
    }
});


module.exports = db;
