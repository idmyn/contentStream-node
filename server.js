const mongoose = require('mongoose')

const express = require('express')
const app = express()
const PORT = 3001

mongoose.connect("mongodb://localhost/contentStream", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const postsRouter = require('./routes/posts')
app.use('/posts', postsRouter)

const bucketsRouter = require('./routes/buckets')
app.use('/buckets', bucketsRouter)

const twitterRouter = require('./routes/twitter')
app.use('/twitter', twitterRouter)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
