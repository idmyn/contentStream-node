require('dotenv').config()
const express = require('express')
const router = express.Router()
const API = require('../api/twitter')

router.get('/login', async (req, res) => {
  // throw error if JWT header missing
  try {
    API.buildAuthURL().then(URL => res.redirect(URL))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/success', async (req, res) => {
  try {
    API.requestTwitterCreds({ ...req.query })
      .then(console.log)
    // API.requestTwitterCreds({ ...req.query })
    //   .then(API.buildTwitterClient)
    //   .then(client => API.postTweet(client, 'Please Please Please £1 fish £1 fish'))
    // res.redirect('/twitter/timeline')
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/tweet', (req, res) => {
  try {
    res.json(req)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  // try {
  //   await client.post('statuses/update', {
  //     status: 'Status'
  //   }).catch(console.log)
  //   res.redirect('http://localhost:3001')
  // } catch (err) {
  //   res.status(500).json({ message: err.message })
  // }
})

router.get('/timeline', async (req, res) => {
  // try {
  //   const timeline = await client
  //     .get('statuses/home_timeline', {})
  //     .then(timeline => timeline.map(post => post.id_str))
  //     .then(postIds => res.json(postIds))
  try {
    res.json(req)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
