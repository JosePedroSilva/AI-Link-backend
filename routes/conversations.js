const express = require('express');
const router = express.Router();
const db = require('../db.js');

//*
// * 1. GET /conversations
// * 2. POST /conversations/send-message
// * 3. GET /conversations/messages/:conversationId
// */

// 1. GET /conversations
// Get all active conversations
router.get('/', (req, res) => {
    db.all('SELECT * FROM conversations where active = 1', (err, rows) => {
        console.log('GET /conversations', rows, err)
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 2. POST /conversations/send-message
// Send a message to a conversation
router.post('/send-message', async (req, res) => {
    const { conversationId, message } = req.body;

    console.log('POST /conversations/send-message', conversationId, message)

    if (!conversationId || !message) {
        res.status(400).json({ message: 'Missing params message' });
        return;
    }

    try {
        const existingConversation = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM conversations WHERE id = ?', [conversationId], (err, row) => {
                if (err) reject(err);
                resolve(row); // Resolve with the row (or undefined if not found)
            });
        });

        let convId;
        if (!existingConversation) {
            const uniqueId = crypto.randomUUID();
            console.log('Creating new conversation with id', uniqueId, typeof uniqueId);
            await db.run('INSERT INTO conversations (id) VALUES (?)', [uniqueId]);
            c1onvId = uniqueId
        } else {
            convId = existingConversation.id;
        }

        await db.run('INSERT INTO messages (conversation_id, sender, content) VALUES (?, ?, ?)', [convId, 'user', message]);

        res.status(201).json({ message: 'Message sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. GET /conversations/messages/:conversationId
// Get all messages from a conversation
// TODO: Add pagination
router.get('/messages/:conversationId', (req, res) => {
    const { conversationId } = req.params;

    console.log('GET /conversations/messages/:conversationId', conversationId)

    db.all('SELECT * FROM messages WHERE conversation_id = ?', [conversationId], (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;