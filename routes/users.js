const argon2 = require('argon2')
const express = require('express')
const router = express.Router()
const User = require('../models/user')

const serialize = (user) => (
  { id: user._id, email: user.email }
)

// index
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users.map(user => serialize(user)))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// create
router.post('/', async (req, res) => {
  const passwordHash = await argon2.hash(req.body.password)

  const user = new User({
    email: req.body.email,
    password: passwordHash
  })

  try {
    const newUser = await user.save()
    res.status(201).json(serialize(newUser))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// show
router.get('/:id', (req, res) => {
})

// update
router.patch('/:id', (req, res) => {
})

// delete
router.delete('/:id', (req, res) => {
})

module.exports = router
