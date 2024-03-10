const express = require('express')
const cors = require('cors')
const usersRoutes = require('./routes/users');
const conversationsRoutes = require('./routes/conversations');
const app = express()
const port = 3001

app.use(cors())
app.use(express.json());

app.use('/conversations', conversationsRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})