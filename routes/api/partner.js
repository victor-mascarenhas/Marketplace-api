const express = require('express')
const router = express.Router();
const User = require('../../models/user')

// @route    GET /partner
// @desc     LIST partner
// @access   Private
router.get('/', async (req, res, next) => {
    try {
      const partner = await User.find({partner: true})
      res.json(partner)
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": 'Erro!' })
    }
  })


module.exports = router;