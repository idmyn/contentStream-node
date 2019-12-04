require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../api/twitter')
const Account = require('../models/account')

router.get('/login', async (req, res) => {
  // throw error if JWT header missing
  try {
    console.log('login req received')
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    const account = await Account.findOne({ user: decoded.id })
    if (account) {
      const client = await API.buildTwitterClient(account)
      const details = await API.fetchAccountDetails(client)
      console.log(details)
      res.json(details)
    } else {
      API.buildAuthURL().then(URL => {
        console.log('url', URL)
        res.status(401).json(URL)
      }).catch(err => console.log(err.message))
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/success', async (req, res) => {
  try {
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    console.log('decoded', decoded)
    console.log('creds?', req.body)

    try {
      const twitterParams = req.body
      const creds = await API.requestTwitterCreds({ ...twitterParams })
      console.log(creds)
      const account = await API.createAccount(decoded.id, creds)
      const client = await API.buildTwitterClient(account)
      const details = await API.fetchAccountDetails(client)
      console.log(details)
      res.json(details)
    } catch (err) {
      console.log('outer catch', err)
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/tweet', async (req, res) => {
  try {
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    console.log('decoded', decoded)
    const account = await Account.findOne({ user: decoded.id })
    if (account) {
      const client = await API.buildTwitterClient(account)
      await client.post('statuses/update', {
        status: req.body.status
      }).catch(console.log)
    } else {
      res.status(401).json('You need to log into Twitter to use this feature.')
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/timeline', async (req, res) => {
  try {
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    console.log('decoded', decoded)
    const account = await Account.findOne({ user: decoded.id })
    if (account) {
      const client = await API.buildTwitterClient(account)
      const timeline = await API.fetchTimeline(client)
      console.log(timeline)
      res.json(timeline)
    } else {
      res.status(401).json('You need to log into Twitter to use this feature.')
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
