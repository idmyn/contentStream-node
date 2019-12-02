const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const request = require('request-promise-native')
const Twitter = require('twitter')
const encodeUrl = require('encodeurl')
require('dotenv').config()
const consumer_key = process.env.CONSUMER_KEY
const consumer_secret = process.env.CONSUMER_SECRET
let tmpOauthToken;
let tmpOauthTokenSecret;
// const Api = require('../api/config')

router.get('/login', async(req, res) => {
    try {
        const result = await request.post(loginConfig)
        //options has to come from the config options
        tmpOauthToken = result.split('&')[0].split('=')[1]
        tmpOauthTokenSecret = result.split('&')[1].split('=')[1]
        //Put this all into keys
        res.json(`https://api.twitter.com/oauth/authorize?oauth_token=${tmpOauthToken}`)
        //Call this the callback url
      } catch (err) {
        res.status(500).json({ message: err.message })
      } 
})

router.get('/success', async(req, res) => {
    try {
        const tmpOauthToken = req.query.oauth_token
        const oauthVerifier = req.query.oauth_verifier
        //Get these varuables from another function
        //Store relevant information inside the keys variable
        sendrequestToTwitter(tmpOauthToken, oauthVerifier, tmpOauthTokenSecret)
        res.redirect('http://localhost:3001')
        //Redirect back to where the user wants to be after logging in
      } catch (err) {
        res.status(500).json({ message: err.message })
      } 
})

const sendrequestToTwitter = async (tmpOauthToken, oauthVerifier, tmpOauthTokenSecret) => {
    const requestConfig = {
      headers: { Accept: '*/*', Connection: 'close', 'User-Agent': 'node-twitter/1' },
      oauth: {
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        token: tmpOauthToken,
        token_secret: tmpOauthTokenSecret,
        verifier: oauthVerifier,
      },
      url: `https://api.twitter.com/oauth/access_token`,
    }
    const result = await request.post(requestConfig)
        .then(result => createTwitterSesssion(result))
        .then(client => postTweet(client))
        .catch(console.log)
    return result
}

const createTwitterSesssion = async(result) => {
    oauthToken = result.split('&')[0].split('=')[1]
    oauthTokenSecret = result.split('&')[1].split('=')[1]
    //send all of this into the keys
    client = new Twitter({
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        access_token_key: oauthToken,
        access_token_secret: oauthTokenSecret
    })
}

const postTweet = async() => {
    const post = await client.post('statuses/update', {
        status: 'Please Please Please £1 fish £1 fish'
    })
    .catch(console.log)
}

const loginConfig = {
    headers: { Accept: '*/*', Connection: 'close', 'User-Agent': 'node-twitter/1' },
    oauth: {
      consumer_key: consumer_key,
      consumer_secret: consumer_secret,
      //Comes from the keys folder
      callback: encodeUrl('http://localhost:3001/twitter/success'),
      //Put in the callback url
    },
    url: `https://api.twitter.com/oauth/request_token`,
}

module.exports = router
//Store this whole thing as a config object inside the api folder