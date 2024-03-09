const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(rows);
        }
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else if (!row) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json({ id: this.lastID, name, email });
        }
    });
});

module.exports = router;