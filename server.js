const mongoose = require('mongoose')

const express = require('express')
const app = express()
const PORT = 3001

mongoose.connect("mongodb://localhost/contentStream", { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
