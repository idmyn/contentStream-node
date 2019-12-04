const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const Bucket = require('../models/bucket')

const serialize = (post) => (
  {
    id: post._id,
    sourceId: post.sourceId,
    domain: post.domain,
    buckets: post.buckets
  }
)

// index
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// create
router.post('/', async (req, res) => {
  try {
    const bucket = await Bucket.findOne({ _id: req.body.bucketId })
    console.log('bucket:', bucket)
    const post = new Post({
      sourceId: req.body.sourceId,
      domain: req.body.domain,
      bucket: bucket._id
    })
    const newPost = await post.save()
    console.log('newPost', newPost)

    bucket.posts.push(newPost._id)
    const savedBucket = await bucket.save()
    console.log(savedBucket)

    res.status(201).json(newPost)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
