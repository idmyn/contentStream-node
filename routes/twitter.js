require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const API = require('../api/twitter')
const Account = require('../models/account')

// const fakeHeader = {
//   "user": {
//     "id": "5de549a4cefe4a469b587f8b",
//     "email": "newnewnew@twitter.com"
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZTU0OWE0Y2VmZTRhNDY5YjU4N2Y4YiIsImVtYWlsIjoibmV3bmV3bmV3QHR3aXR0ZXIuY29tIiwiaWF0IjoxNTc1MzA3Njg0LCJleHAiOjE1NzUzMjkyODR9.VDu86mjU1j373A8oPqh1aB7r-GB77TwKwQFFq6hPrz4"
// }

// const addAccountToJWT = (account, token) => {
//   const decoded = jwt.verify(token, process.env.SIGNATURE)
//   console.log('adding acc', account)
//   console.log('decoded', decoded)
//   const newToken = {
//     id: decoded.id,
//     email: decoded.email,
//     accounts: [
//       {
//         id: account._id,
//         domain: account.domain,
//         oauthKey: account.oauthKey,
//         oauthSecret: account.oauthSecret
//       }
//     ]
//   }
//   console.log('newToken', newToken)
//   return jwt.sign(newToken, process.env.SIGNATURE, { expiresIn: '6h' })
// }

router.get('/login', async (req, res) => {
  // throw error if JWT header missing
  try {
    console.log('login req received')
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    const accounts = await API.findAccounts(decoded.id)
    console.log('accounts', accounts)
    if (accounts.length > 0) {
      // const newToken = addAccountToJWT(accounts[0], fakeHeader.token)
      // res.json({ token: newToken })
      // console.log(accounts[0])
      console.log('account exists')
      res.json("You've logged in before")
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
  // we'll change the twitter dev settings to callback to front-end, then frontend will make post to backend/twitter/success with _id and oauth tuple. this method will then store those account deets in the backend to shortcircuit the /twitter/login path next time
  try {
    // console.log('headers', req.headers)
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    console.log('decoded', decoded)
    console.log('creds?', req.body)
    // const account = new Account({
    //   domain: 'twitter.com',
    //   user: decoded.id,
    //   oauthKey: req.body.oauth_token,
    //   oauthSecret: req.body.oauth_verifier
    // })

    try {
      const twitterParams = req.body
      const creds = await API.requestTwitterCreds({ ...twitterParams })
      console.log(creds)
      const client = API.buildTwitterClient(creds)
      // console.log('client', client)
      client.get('https://api.twitter.com/1.1/statuses/home_timeline.json', {}).then(console.log).catch(console.log)
      // client.post('statuses/update', {status: 'I Love Twitter'},  function(error, tweet, response) {
      //   if(error) throw error;
      //   console.log(tweet);  // Tweet body.
      //   console.log(response);  // Raw response object.
      // }).catch(console.log)
    } catch (err) {
      console.log('outer catch', err)
    }

    // res.json('Logged in!')

    // API.requestTwitterCreds({ ...req.query }, fakeHeader.user.id)
    //   .then(account => {
        // const newToken = addAccountToJWT(account, fakeHeader.token)
        // res.json({ token: newToken })
        // res.redirect('http://localhost:3000/home')
      // })

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
  console.log('headers', req.headers)
  const token = req.headers.authorisation
  const decoded = jwt.verify(token, process.env.SIGNATURE)
  console.log('decoded', decoded)
  try {
    res.json("hi")
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
