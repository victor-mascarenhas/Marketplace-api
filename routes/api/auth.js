const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const MSGS = require ('../../messages')

router.post('/',[
    check('email', MSGS.VALID_EMAIL).isEmail(),              
    check('password', MSGS.REQUIRED_PASSWORD).exists()
], async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }
        const { email, password } = req.body
        const jwtSecret = process.env.jwtSecret || config.get('jwtSecret')

        try{
        let user = await User.findOne({ email }).select('id password email name partner')
        if(!user){
            return res.status(400).json({ errors: [{ msg: MSGS.USER404 }] })
        }else{
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({ errors: [{ msg: MSGS.PASSWORD_INVALID }] })
            }else{
                const payload = {
                    user: {
                    id: user.id,
                    name: user.name,
                    email: user.email, 
                    partner: user.partner 
                    }
                }
                jwt.sign(payload, jwtSecret, { expiresIn: '5 days'},
                (err, token) => {
                    if (err) throw err;
                    payload.token = token
                    res.json(payload)
                })
            }
        }
        }catch(err){
        console.error(err.message)
        res.status(500).send({"error":MSGS.GENERIC_ERROR})
        }

})

module.exports = router;