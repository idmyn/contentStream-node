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
    API.requestTwitterCreds(req.query.oauth_token, req.query.oauth_verifier)
      .then(API.buildTwitterClient)
      .then(API.postTweet)
    res.redirect('/')
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/create_tweet', async(req, res) => {
    try {
      const post = await client.post('statuses/update', {
        status: "Status"
      })
      .catch(console.log)
      res.redirect('http://localhost:3001')
      //Redirect this back to the main page
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
})

router.get('/hometimeline', async(req, res) => {
  try {
    const timeline = await client.get('statuses/home_timeline', {})
    .then(timeline => timeline.map(post => post.id_str))
    .then(postIds => res.json(postIds))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
