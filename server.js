const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/contentStream', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const accountsRouter = require('./routes/accounts')
app.use('/accounts', accountsRouter)

const postsRouter = require('./routes/posts')
app.use('/posts', postsRouter)

const bucketsRouter = require('./routes/buckets')
app.use('/buckets', bucketsRouter)

const twitterRouter = require('./routes/twitter')
app.use('/twitter', twitterRouter)

const PORT = 3001
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
