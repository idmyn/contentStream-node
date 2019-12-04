const express = require('express')
const router = express.Router()
const Bucket = require('../models/bucket')
const jwt = require('jsonwebtoken')

const serialize = (bucket) => {
  // const posts = await Post.find({ bucket: bucket._id })
  // console.log(posts)
  return {
    id: bucket._id,
    name: bucket.name,
    posts: bucket.posts.map(post => (
      { id: post._id, sourceId: post.sourceId, domain: post.domain }
    ))
  }
}

const getBucket = async (req, res, next) => {
  let bucket

  try {
    bucket = await Bucket.findById(req.params.id)
    if (bucket == null) {
      return res.status(404).json({ message: "Can't find bucket" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.bucket = bucket
  next()
}

// index
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    const buckets = await Bucket.find({ user: decoded.id })
    console.log('buckets', buckets)
    // const serialized = buckets.map(bucket => serialize(bucket))
    // res.json(serialized)
    res.json(buckets.map(bucket => serialize(bucket)))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// create
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    const bucket = new Bucket({
      name: req.body.name,
      user: decoded.id
    })
    const newBucket = await bucket.save()
    res.status(201).json(serialize(newBucket))
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

// delete
router.delete('/:id', getBucket, async (req, res) => {
  try {
    await res.bucket.remove()
    res.json({ message: 'Deleted This Bucket' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
