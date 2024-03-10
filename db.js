// Inside db.js
const sqlite3 = require('sqlite3').verbose();
module.exports = new sqlite3.Database('db.sqlite');

