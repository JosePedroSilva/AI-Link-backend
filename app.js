const express = require('express')
const cors = require('cors')
const conversationsRoutes = require('./routes/conversations');
const app = express()

app.use(cors())
app.use(express.json());

app.use('/conversations', conversationsRoutes);

module.exports = app;