const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  oauthKey: {
    type: String
  },
  oauthSecret: {
    type: String
  }
})

module.exports = mongoose.model('Account', accountSchema)
