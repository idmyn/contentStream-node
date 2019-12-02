const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    required: true
  },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }]
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
