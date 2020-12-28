const express = require('express')
const router = express.Router();
const Partner = require('../../models/partner')
const MSGS = require('../../messages')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth')

// @route    GET /partner
// @desc     LIST partner
// @access   Private
router.get('/', async (req, res, next) => {
    try {
      const partner = await Partner.find({})
      res.json(partner)
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": 'Erro!' })
    }
  })

// @route    GET /partner/:id
// @desc     get one users
// @access   Private
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const partner = await Partner.findById(id)
    if(partner){
      res.json(partner)
    }else{
      res.status(404).send({ "error": MSGS.PARTNER404 }) 
    }
    
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": 'Erro!' })
  }
})

// @route    PATCH /partner/:partnerId
// @desc     PARTIAL EDIT partner
// @access   Private
router.patch('/:partnerId', auth,[
  check('email', MSGS.VALID_EMAIL).isEmail()
], async (request, res, next) => {
  try {
    const id = request.params.userId
    const salt = await bcrypt.genSalt(10)
    let bodyRequest = request.body

    if(bodyRequest.password){
      bodyRequest.password = await bcrypt.hash(bodyRequest.password, salt)
    }
    const update = { $set: bodyRequest }
    const partner = await Partner.findByIdAndUpdate(id, update, { new: true })
    if (partner) {
      res.send(partner)
    } else {
      res.status(404).send({ error: MSGS.USER404 })
    }
  } catch (err) {
    res.status(500).send({ "error": err.message })
  }
})

// @route    POST /partner
// @desc     create partner
// @access   Public
router.post('/',[
  check('email', MSGS.VALID_EMAIL).isEmail(),
  check('name', MSGS.PARTNER_NAME_REQUIRED).not().isEmpty(),
  check('password', MSGS.PASSWORD_VALIDATED).isLength({ min: 6 })
], async (req, res, next) => {
  try {
    let password  = req.body.password

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      let partner = new Partner(req.body)
      
      const salt = await bcrypt.genSalt(10);
      partner.password = await bcrypt.hash(password, salt);
      await partner.save()
      if (partner.id) {
        res.json(partner);
      }
    }
  } catch (err) {
    res.status(500).send({ "error": err.message })
  }
})

module.exports = router;