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

const getPost = async (req, res, next) => {
  let post

  try {
    post = await Post.findById(req.params.id)
    if (post == null) {
      return res.status(404).json({ message: "Can't find post" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.post = post
  next()
}

// index
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
    res.json(posts.map(post => serialize(post)))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// create
router.post('/', async (req, res) => {
  try {
    const bucket = await Bucket.findOne({ _id: req.body.bucketId })
    console.log('bucket:', bucket)
    console.log('body:', req.body)
    if (bucket.posts.map(post => post.sourceId).includes(req.body.sourceId)) {
      throw new Error('This post was in this bucket already.')
    }
    const post = new Post({
      sourceId: req.body.sourceId,
      domain: req.body.domain,
      sourceCreatedAt: req.body.sourceCreatedAt,
      text: req.body.text,
      bucket: bucket._id
    })
    const newPost = await post.save()
    console.log('newPost', newPost)

    bucket.posts.push(newPost._id)
    const savedBucket = await bucket.save()
    // console.log(savedBucket)

    res.status(201).json(serialize(newPost))
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

// delete
router.delete('/:id', getPost, async (req, res) => {
  try {
    const bucket = await Bucket.findById(res.post.bucket)
    bucket.posts = bucket.posts.filter(post => post != req.params.id)
    await res.post.remove()
    await bucket.save
    res.json({ message: 'Deleted This Post' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
