const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'));

//*
// * 1. GET /conversations
// * 2. POST /conversations/send-message
// * 3. GET /conversations/messages/:conversationId
// */

// 1. GET /conversations
// Get all active conversations
router.get('/', async (req, res) => {
    try {
        const conversations = await knex('conversations')
            .where('active', 1)
            .select();

        console.log('GET /conversations', conversations);
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
        // Check for existing conversation
        const existingConversation = await knex('conversations')
            .where('id', conversationId)
            .first(); // Fetch only the first match

        let convId;
        if (!existingConversation) {
            const uniqueId = crypto.randomUUID();
            console.log('Creating new conversation with id', uniqueId, typeof uniqueId);
            const [insertedId] = await knex('conversations').insert({ id: uniqueId, title: message.substring(0, 10) });
            convId = insertedId;
        } else {
            convId = existingConversation.id;
        }

        // Insert message
        await knex('messages').insert({
            conversation_id: convId,
            sender: 'user',
            content: message
        });

        res.status(201).json({ message: 'Message sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. GET /conversations/messages/:conversationId
// Get all messages from a conversation
router.get('/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const { page = 1, limit = 2 } = req.query;

    const offset = (page - 1) * limit;

    if (!conversationId) {
        res.status(400).json({ message: 'Missing params conversationId' });
        return;
    }

    console.log('GET /conversations/messages/:conversationId', conversationId);

    try {
        const [messages, countResult] = await Promise.all([
            knex('messages')
                .where('conversation_id', conversationId)
                .limit(limit)
                .offset(offset),

            knex('messages')
                .where('conversation_id', conversationId)
                .count('* as total')
        ]);

        const total = countResult[0].total;
        const lastPage = Math.ceil(total / limit);

        if (page > lastPage) {
            res.status(400).json({ message: 'Page out of range', pagination: { page, limit, total, lastPage } });
            return;
        }

        res.json({
            messages,
            pagination: {
                page,
                limit,
                total,
                lastPage
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;