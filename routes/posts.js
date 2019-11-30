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
  const post = new Post({
    sourceId: req.body.id,
    domain: req.body.domain
  })

  try {
    const newPost = await post.save()
    res.status(201).json(newPost)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
