const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'Email address is required',
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true,
    // https://emailregex.com/
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String,
    required: 'Password is required'
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
