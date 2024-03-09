const express = require('express')
const cors = require('cors')
const usersRoutes = require('./routes/users');
const app = express()
const port = 3001

app.use(cors())
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})