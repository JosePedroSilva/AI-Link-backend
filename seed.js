const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE conversations (\
        id STRING PRIMARY KEY, \
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, \
        active BOOLEAN NOT NULL DEFAULT 1,\
        title STRING NOT NULL DEFAULT 'New conversation'\
        )");

    db.run("CREATE TABLE messages (\
        id INTEGER PRIMARY KEY, \
        conversation_id INTEGER, \
        content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, \
        sender TEXT NOT NULL,\
        FOREIGN KEY(conversation_id) REFERENCES conversations(id) ) ");
});


db.close();