const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const auth = require('../../middleware/auth')


router.post('/', auth, async(req, res, next) => {
    try {
        data = req.body
        let user = await User.findById(req.user.id)
        user.products.push(req.body.id)
        await user.save()
        if (user.id){
            res.json(user.products)
        }
    } catch (err) {
      res.status(500).send({ "error": err.message })
    }
})

router.delete('/', auth, async(req, res, next) => {
    try {        
        data = req.body
        let user = await User.findById(req.user.id)
        user.products.pull(req.body.id)
        await user.save()
        if (user.id){
            res.json(user.products)
        }
    } catch (err) {
      res.status(500).send({ "error": err.message })
    }
})

module.exports = router;




