const request = require('request-promise-native')
const Twitter = require('twitter')
const encodeUrl = require('encodeurl')

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

  static requestTwitterCreds = (
    tmpOauthToken,
    oauthVerifier
  ) => {
    return request.post({
      twitterHeaders,
      oauth: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        token: tmpOauthToken,
        token_secret: this.tmpOauthTokenSecret,
        verifier: oauthVerifier
      },
      url: 'https://api.twitter.com/oauth/access_token'
    }).then(response => {
      const oauthKey = response.split('&')[0].split('=')[1]
      const oauthSecret = response.split('&')[1].split('=')[1]
      return { oauthKey, oauthSecret }
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

  static postTweet = (client) => {
    console.log(client)
    client
      .post('statuses/update', {
        status: 'Please Please Please £1 fish £1 fish'
      }).catch(console.log)
  }
}

module.exports = API
