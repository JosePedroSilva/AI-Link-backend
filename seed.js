const db = require('./db'); // Or wherever your database connection is established

async function seedData() {
    await db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE
    )`);
    await db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['Alice Johnson', 'alice@example.com']);
    await db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['Bob Smith', 'bob@example.com']);
    // ... more data seeding logic
}

// Call the seed function on server start if desired
seedData();