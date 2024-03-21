const request = require('supertest');
const app = require('../app'); // adjust the path to your file

describe('Conversations API', () => {
    it('should return a list of conversations', async () => {
        const res = await request(app)
            .get('/conversations');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should create a new conversation', async () => {
        const res = await request(app)
            .post('/conversations/send-message')
            .send({ conversationId: 'non-existent-id', message: 'test' });

        expect(res.status).toEqual(201);
        expect(res.body.message).toEqual('Message sent');
    });

    it('should return a list of messages for a conversation', async () => {
        const res = await request(app)
            .get('/conversations/messages/non-existent');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});