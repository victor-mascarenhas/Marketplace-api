const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const partner = require('../../middleware/partner')
const auth = require('../../middleware/auth')
const file = require('../../middleware/file')
const config = require('config');
const bcrypt = require('bcryptjs');
const MSGS = require('../../messages');

// @route    GET /partner
// @desc     LIST partner
// @access   Private
router.get('/', async (req, res, next) => {
  try {
    let partner = await User.find({ partner: true })

    const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
    partner = partner.map(function (partner) {
    partner.photo = `${BUCKET_PUBLIC_PATH}${partner.photo}`
    return partner
    })
    res.json(partner)
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": 'Erro!' })
  }
})


//@route   PATCH/partner/
//@desc    PARTIAL UPDATE partner
//@access  Private
router.patch('/', auth, partner, file, async (req, res, next) => {
  try {
    if (req.body.photo_name) {
      req.body.photo = `partner/${req.body.photo_name}`
    } else {
      delete req.body.photo
    }
    const id = req.user.id
    const salt = await bcrypt.genSalt(10)
    let data = req.body
    if (data.password) {
      data.password = await bcrypt.hash(data.password, salt)
    }
    const update = { $set: data }
    const partner = await User.findByIdAndUpdate(id, update, { new: true })

    if (partner) {
      const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
      partner.photo = `${BUCKET_PUBLIC_PATH}${partner.photo}`
      res.json(partner)
    } else {
      res.status(404).send({ "error": MSGS.PARTNER404 })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }

})




module.exports = router;