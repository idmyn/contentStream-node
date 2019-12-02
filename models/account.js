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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Account', accountSchema)
