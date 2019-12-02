const express = require('express')
const router = express.Router()
const Bucket = require('../models/bucket')

router.get('/', async (req, res) => {
    try {
      
      res.json(buckets)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })