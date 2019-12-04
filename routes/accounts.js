const express = require('express')
const router = express.Router()
const Account = require('../models/account')

const getAccount = async (req, res, next) => {
  let account

  try {
    account = await Account.findById(req.params.id)
    if (account == null) {
      return res.status(404).json({ message: "Can't find account" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.account = account
  next()
}

// delete
router.delete('/:id', getAccount, async (req, res) => {
  try {
    await res.account.remove()
    res.json({ message: 'Deleted This Account' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
