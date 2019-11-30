const express = require('express')
const router = express.Router()
const Bucket = require('../models/bucket')

// index
router.get('/', async (req, res) => {
  try {
    const buckets = await Bucket.find()
    res.json(buckets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// create
router.post('/', async (req, res) => {
  const bucket = new Bucket({
    name: req.body.name
  })

  try {
    const newBucket = await bucket.save()
    res.status(201).json(newBucket)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
