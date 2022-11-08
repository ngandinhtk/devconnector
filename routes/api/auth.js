
const express = require('express');
const router = express.Router()
const auth = require('../../middleware/auth');
const User = require('../../models/User')
const asyncHandler = require('express-async-handler')
const {check, validationResult} = require("express-validator")
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


// @route POST api/auth 
// @desc test module
const test = async(req, res) => {
    const _id = req.user.id

    try {
        // was getting error when not used await      
        const user = await User.findById(_id).select('-password');
        if (!user) {
            return res.status(402).send('ffffffff')
        } else {
            return res.send({user: user});
        }
    } catch (e) {
    //    return res.status(500).send('errror');
        console.error(e);
       
    }
}
router.get('/', auth, asyncHandler(test))

// @route POST api/auth
// @desc test module

router.post('/', 
[
    check('email', 'please include valid email').isEmail(),
    check('password', 'please include password').exists()
] ,
async (req, res) => {
    const response = validationResult(req) 
    if (response.errors.length != 0) {
        return res.status(400).json({response: response.array()})
    }
    
    try {
        const { email, password} = req.body;
        // console.log(req.body);
        // see if users exist 
        let user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({response: [{msg: 'Invalid Credentials'}]});
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({response: [{msg: 'password not match'}]});
        }
        const payload = {
            user : {
                id: user.id,
            }
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, function(err, token) {
            if (err) {
                throw err
            }
            res.json({token})
        });
        
    } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
    }
}
)



module.exports = router;