const mongoose = require('mongoose')

const bucketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

module.exports = mongoose.model('Bucket', bucketSchema)
