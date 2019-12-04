const express = require('express')
const router = express.Router()
const Bucket = require('../models/bucket')
const Post = require('../models/post')
const jwt = require('jsonwebtoken')

const serialize = (bucket) => {
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
    const duplicates = await Bucket.find({ user: decoded.id, name: req.body.name })
    if (duplicates.length > 0) {
      throw new Error('You already have a bucket with the name ' + req.body.name)
    }
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
    await Post.deleteMany({ _id: { $in: res.bucket.posts } }, (err) => console.log(err))
    await res.bucket.remove()
    res.json({ message: 'Deleted This Bucket' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
