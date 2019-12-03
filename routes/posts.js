const express = require('express')
const router = express.Router()
const Post = require('../models/post')

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
    const foundPost = Post.findOne({ sourceId: req.body.id })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

  // const post = new Post({
  //   sourceId: req.body.id,
  //   domain: req.body.domain
  // })

  // post.buckets.push(req.bucketId)

  try {
    // const newPost = await post.save()
    // res.status(201).json(newPost)
    res.json("post recieved", foundPost)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
