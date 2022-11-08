const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')

// @route GET api/posts
// @desc test module
router.post('/', 
[auth,
    check('text', 'text is required').not().isEmpty(),
]
,
async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({error: error.array()})
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const newPost = {
                text: req.body.text,
                name: user.avatar,
                avatar : user.avatar,
                user: req.user.id
            }
            await newPost.save();
            res.json(profile)

        } catch (error) {
            console.error(error.message);
            res.status(500).send('server errrorrrrrrrrrrr')
        }
        
})

module.exports = router;