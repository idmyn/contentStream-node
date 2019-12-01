require('dotenv').config()
const express = require('express')
const router = express.Router()

const OAuth = require('oauth')


router.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth/twitter">Log in with Twitter</a>')
})

router.get('/twitter', (req, res) => {
  var OAuth2 = OAuth.OAuth2;
     var twitterConsumerKey = 'your key';
     var twitterConsumerSecret = 'your secret';
     var oauth2 = new OAuth2(twitterConsumerKey,
       twitterConsumerSecret,
       'https://api.twitter.com/',
       null,
       'oauth2/token',
       null);
     oauth2.getOAuthAccessToken(
       '',
       {'grant_type':'client_credentials'},
       function (e, access_token, refresh_token, results){
       console.log('bearer: ',access_token);
     })
})

module.exports = router
