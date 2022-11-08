const express = require('express');
const router = express.Router()
const {check, validationResult} = require("express-validator")
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')

// @route POST api/users
// @desc test module
router.post('/', 
[
    check('name', 'name is required').not().isEmpty(),
    check('email', 'please include valid email').isEmail(),
    check('password', 'please include more than 6').isLength({min: 6})
] ,
async (req, res) => {
    const response = validationResult(req) 
   if (response.errors.length != 0) {
    return res.status(400).json({response: response.array()})
   }
   try {
    const {name, email, password} = req.body;
        // see if users exist 
        let user = await User.findOne({email})
        if(user) {
            res.status(400).json({response: [{msg: 'user already exist'}]});
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save();

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

router.get('/', (req,res) =>  {
    console.log(req.body);

    res.send(req.body)
} 
)
module.exports = router;