const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  sourceId: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  bucket: { type: mongoose.Schema.Types.ObjectId, ref: 'Bucket' }
})

module.exports = mongoose.model('Post', postSchema)
