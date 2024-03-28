module.exports = {
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite'
    },
    migrations: {
        tableName: 'migrations',
        directory: './db/migrations'
    },
    useNullAsDefault: true
};