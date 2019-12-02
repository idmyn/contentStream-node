require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../api/twitter')
const User = require('../models/user')

const fakeHeader = {
  "user": {
    "id": "5de549a4cefe4a469b587f8b",
    "email": "newnewnew@twitter.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZTU0OWE0Y2VmZTRhNDY5YjU4N2Y4YiIsImVtYWlsIjoibmV3bmV3bmV3QHR3aXR0ZXIuY29tIiwiaWF0IjoxNTc1MzA3Njg0LCJleHAiOjE1NzUzMjkyODR9.VDu86mjU1j373A8oPqh1aB7r-GB77TwKwQFFq6hPrz4"
}

const addAccountToJWT = (account, token) => {
  const decoded = jwt.verify(token, process.env.SIGNATURE)
  console.log('adding acc', account)
  console.log('decoded', decoded)
  const newToken = {
    id: decoded.id,
    email: decoded.email,
    accounts: [
      {
        id: account._id,
        domain: account.domain,
        oauthKey: account.oauthKey,
        oauthSecret: account.oauthSecret
      }
    ]
  }
  console.log('newToken', newToken)
  return jwt.sign(newToken, process.env.SIGNATURE, { expiresIn: '6h' })
}


router.get('/login', async (req, res) => {
  // throw error if JWT header missing
  try {
    const accounts = await API.findAccounts(fakeHeader.user.id)
    // console.log(accounts)
    if (accounts.length > 0) {
      const newToken = addAccountToJWT(accounts[0], fakeHeader.token)
      res.json({ token: newToken })
      // console.log(accounts[0])
    } else {
      API.buildAuthURL().then(URL => res.redirect(URL))
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/success', async (req, res) => {
  try {
    API.requestTwitterCreds({ ...req.query }, fakeHeader.user.id)
      .then(account => {
        const newToken = addAccountToJWT(account, fakeHeader.token)
        res.json({ token: newToken })
      })

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
