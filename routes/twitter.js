require('dotenv').config()
const express = require('express')
const router = express.Router()
const API = require('../api/twitter')

router.get('/login', async (req, res) => {
  try {
    API.buildAuthURL().then(URL => res.redirect(URL))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/success', async (req, res) => {
  try {
    API.requestTwitterCreds({ ...req.query })
      .then(API.buildTwitterClient)
      .then(API.postTweet)
    res.redirect('/')
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
