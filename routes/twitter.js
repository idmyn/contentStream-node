require('dotenv').config()
const request = require('request-promise-native')
const Twitter = require('twitter')
const encodeUrl = require('encodeurl')
const express = require('express')
const router = express.Router()
// const API = require('../api/twitter')

const consumerKey = process.env.TWITTER_KEY
const consumerSecret = process.env.TWITTER_SECRET

let tmpOauthTokenSecret

const twitterHeaders = {
  Accept: '*/*',
  Connection: 'close',
  'User-Agent': 'node-twitter/1'
}

const buildAuthURL = () => {
  return request.post({
    twitterHeaders,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      callback: encodeUrl('http://localhost:3001/twitter/success')
    },
    url: 'https://api.twitter.com/oauth/request_token'
  }).then(response => {
    const tmpOauthToken = response.split('&')[0].split('=')[1]
    tmpOauthTokenSecret = response.split('&')[1].split('=')[1]
    return 'https://api.twitter.com/oauth/authorize?oauth_token=' + tmpOauthToken
  })
}

const requestTwitterCreds = (
  tmpOauthToken,
  oauthVerifier,
  tmpOauthTokenSecret
) => {
  return request.post({
    twitterHeaders,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: tmpOauthToken,
      token_secret: tmpOauthTokenSecret,
      verifier: oauthVerifier
    },
    url: 'https://api.twitter.com/oauth/access_token'
  }).then(response => {
    const oauthKey = response.split('&')[0].split('=')[1]
    const oauthSecret = response.split('&')[1].split('=')[1]
    return { oauthKey, oauthSecret }
  })
}

const buildTwitterClient = (creds) => {
  return new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: creds.oauthKey,
    access_token_secret: creds.oauthSecret
  })
}

const postTweet = (client) => {
  console.log(client)
  client
    .post('statuses/update', {
      status: 'Please Please Please £1 fish £1 fish'
    }).catch(console.log)
}

router.get('/login', async (req, res) => {
  try {
    buildAuthURL().then(URL => res.redirect(URL))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/success', async (req, res) => {
  try {
    const tmpOauthToken = req.query.oauth_token
    const oauthVerifier = req.query.oauth_verifier

    requestTwitterCreds(tmpOauthToken, oauthVerifier, tmpOauthTokenSecret)
      .then(buildTwitterClient)
      .then(postTweet)

    res.redirect('/')
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
