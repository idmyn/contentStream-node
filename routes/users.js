require('dotenv').config()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const User = require('../models/user')

const serialize = (user) => (
  { id: user._id, email: user.email }
)

const generateJWT = (user) => (
  jwt.sign(serialize(user), process.env.SIGNATURE, { expiresIn: '6h' })
)

const getUser = async (req, res, next) => {
  let user

  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: "Can't find user" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const failureMessage = 'Incorrect email or password'

  try {
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
      throw new Error(failureMessage)
    } else {
      const correctPassword = await argon2.verify(foundUser.password, password)
      if (!correctPassword) {
        throw new Error(failureMessage)
      } else {
        res.json({
          user: serialize(foundUser),
          token: generateJWT(foundUser)
        })
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

// validate
router.get('/validate', async (req, res) => {
  try {
    const token = req.headers.authorisation
    // console.log(req.headers)
    if (token) {
      const decoded = jwt.verify(token, process.env.SIGNATURE)
      const foundUser = await User.findOne({ _id: decoded.id })
      res.json({
        user: serialize(foundUser),
        token
      })
      // send buckets?
    } else {
      res.status(406)
      res.json('Invalid token')
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

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
    res.status(201).json({
      user: serialize(newUser),
      token: generateJWT(newUser)
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// show
router.get('/:id', getUser, (req, res) => {
  res.json(serialize(res.user))
})

// update
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.email != null) {
    res.user.email = req.body.email
  }

  if (req.body.password != null) {
    res.user.password = await argon2.hash(req.body.password)
  }
  try {
    const updatedUser = await res.user.save()
    res.json(serialize(updatedUser))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// delete
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted This User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
