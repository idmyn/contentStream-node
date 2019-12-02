const request = require('request-promise-native')
const Twitter = require('twitter')
const encodeUrl = require('encodeurl')
const User = require('../models/user')
const Account = require('../models/account')

const consumerKey = process.env.TWITTER_KEY
const consumerSecret = process.env.TWITTER_SECRET

const twitterHeaders = {
  Accept: '*/*',
  Connection: 'close',
  'User-Agent': 'node-twitter/1'
}

class API {
  static buildAuthURL = () => {
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
      this.tmpOauthTokenSecret = response.split('&')[1].split('=')[1]
      return 'https://api.twitter.com/oauth/authorize?oauth_token=' + tmpOauthToken
    })
  }

  static requestTwitterCreds = async ({
    oauth_token, oauth_verifier
  }, id) => {
    let oauthKey
    let oauthSecret
    let user
    return request.post({
      twitterHeaders,
      oauth: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        token: oauth_token,
        token_secret: this.tmpOauthTokenSecret,
        verifier: oauth_verifier
      },
      url: 'https://api.twitter.com/oauth/access_token'
    }).then(response => {
      oauthKey = response.split('&')[0].split('=')[1]
      oauthSecret = response.split('&')[1].split('=')[1]
      const creds = { oauthKey, oauthSecret }
      console.log(creds)
      return { oauthKey, oauthSecret }
    }).then(creds => {
      try {
        return User.findOne({_id: id})
      } catch (err) {
        console.log(err)
      }
    }).then(foundUser =>{
      console.log('yay!', foundUser, )
      user = foundUser
      try {
        const account = new Account({
          domain: 'twitter.com',
          oauthKey: oauthKey,
          oauthSecret: oauthSecret
        })
        console.log(account)
        return account.save()
      } catch (err) {
        console.log(err)
      }
    }).then(account => {
      console.log('saved account:', account)
      try {
        console.log('hi', user)
        user.accounts.push(account._id)
        return user.save()
      } catch (err) {
        console.log(err)
      }
    }).then(savedUser => {
      console.log(savedUser)
    })
  }

  static buildTwitterClient = (creds) => {
    return new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: creds.oauthKey,
      access_token_secret: creds.oauthSecret
    })
  }

  static postTweet = (client, content) => {
    console.log(client)
    client
      .post('statuses/update', {
        status: content
      }).catch(console.log)
  }
}

module.exports = API
