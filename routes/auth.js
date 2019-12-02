require('dotenv').config()
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth/twitter">Log in with Twitter</a>')
})

router.get('/twitter', (req, res) => {
})

module.exports = router
