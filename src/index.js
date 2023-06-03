require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const dynamoDB = require('./database')

const { HOST, PORT } = process.env

//  middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//  Connect all our routes to our application
app.use('/', routes)

app.get('/', (_req, res) => {
    res.send('Hello, world..!!')
})

dynamoDB.connect()

console.log(`Running on http://${HOST}:${PORT}`)

module.exports = app.listen(PORT, HOST)
