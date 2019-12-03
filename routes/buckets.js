const express = require('express')
const router = express.Router()
const Bucket = require('../models/bucket')
const jwt = require('jsonwebtoken')

const serialize = (bucket) => (
  {
    id: bucket._id,
    name: bucket.name,
    posts: bucket.posts
  }
)

// index
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorisation
    const decoded = jwt.verify(token, process.env.SIGNATURE)
    const buckets = await Bucket.find({ user: decoded.id })
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
    // console.log(decoded)
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

module.exports = router
