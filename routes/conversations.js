const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', (req, res) => {
    db.all('SELECT * FROM conversations where active = 1', (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(rows);
        }
    });
});

router.post('/send-message', async (req, res) => {
    const { coversationId, message } = req.body;

    if (!coversationId || !message) {
        res.status(400).json({ message: 'Missing params message' });
        return;
    }

    try {
        const existingConversation = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM conversations WHERE id = ?', [coversationId], (err, row) => {
                if (err) reject(err);
                resolve(row); // Resolve with the row (or undefined if not found)
            });
        });

        let convId;
        if (!existingConversation) {
            const uniqueId = crypto.randomUUID();
            console.log('Creating new conversation with id', uniqueId, typeof uniqueId);
            await db.run('INSERT INTO conversations (id) VALUES (?)', [uniqueId]);
            convId = uniqueId
        } else {
            convId = existingConversation.id;
        }

        await db.run('INSERT INTO messages (conversation_id, sender, content) VALUES (?, ?, ?)', [convId, 'user', message]);

        res.status(201).json({ message: 'Message sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/messages/:conversationId', (req, res) => {
    const { conversationId } = req.params;

    db.all('SELECT * FROM messages WHERE conversation_id = ?', [conversationId], (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;