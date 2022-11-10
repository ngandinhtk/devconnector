const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const ObjectId = require('mongoose').Types.ObjectId; 

// @route GET api/posts
// @desc test module
router.post('/', 
[auth,
    check("text", 'text isss required').not().isEmpty(),
],
async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        console.log(error);
        return res.status(400).json({error: error.array()})
    }
        try {
            const user = await User.findById(req.user.id).select('-password');
            
            let newPost = {
                text: req.body.text,
                name: user.name,
                avatar : user.avatar,
                user: req.user.id
            }

            const post = new Post(newPost);
            await post.save();
            res.json(post);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server errrorrrrrrrrrrr')
        }
        
})


// @route GET api/posts
// @desc test get current posts
// Private
router.get('/', auth, async(req, res) => {
    try {
        const posts = await Post.find().sort({date : -1});
        res.json(posts)
    } catch (error) {
        console.error(error.message);
    }
})

// @route GET api/posts
// @desc test get current posts by ID
// Private
router.get('/:id', auth, async(req, res) => {
    try {
        const posts = await Post.findById(req.params.id)
        if (!posts) {
            return res.status(404).json({msg: 'posts not found'})
        }
        res.json(posts)
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(401).json('profile not found')
        }
        res.status(500).send('server error nheeeee')
    }
})

// @route detele api/posts
// @desc test delete current posts
// Private
router.delete('/:id', auth, async (req, res)=> {
    try {
        const posts = await Post.findById(req.params.id);
        //check user 
        if (!posts) {
            return res.status(303).json('post not found');
        }
        if (posts.user.toString() !== req.user.id) {
            return res.status(301).send('user not authorized');
        } 
        await posts.remove();        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server loi roiiiiiiiii')
    }
})

// @route detele api/posts/like/:id
// @desc like a post
// Private
router.put('/like/:id', auth , async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json('post already liked');
        }
        post.likes.unshift({user : req.user.id})
        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server loi roiiiiiiiii')
    }
})
// @route detele api/posts/unlike/:id
// @desc unlike a post
// Private
router.put('/unlike/:id', auth , async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json('post has been liked');
        }

        // get remove index
        const removeIndex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1);

        await post.save()
        return res.status(400).json('post has been liked');

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server loi roiiiiiiiii')
    }
})


// @route detele api/posts/comment/:id
// @desc unlike a post
// Private
router.post('/comment/:id', 
[auth,
    check("text", 'text is required').not().isEmpty(),
],
async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        console.log(error);
        return res.status(400).json({error: error.array()})
    }
        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);
            console.log(post);
            let newComment = {
                text: req.body.text,
                name: user.name,
                avatar : user.avatar,
                user: req.user.id
            }
            console.log(newComment);
            // console.log(post);
            post.comments.unshift(newComment)
            await post.save();
            res.json(post);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('server errrorrrrrrrrrrr')
        }     
})

// @route detele api/posts/comment/:id
// @desc delete a comment
// Private
router.delete('/comment/:id/:cmt_id', [auth], 
async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // console.log(post.comments[0].id, req.params.cmt_id);
        //pull out comment
        const comment = post.comments.find(cmt => cmt.id.toString() == req.params.cmt_id);
        // console.log(comment);
        if (!comment) {
            return res.status(400).json({msg: 'comment does not exist'})
        }
        // check usser 
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'user not authorized'})
        }
        const removeIndex = post.comments.map(cmt => cmt.user.toString()).indexOf(req.user.id)
        console.log(removeIndex);

        post.comments.splice(removeIndex, 1);
        await post.save();

        res.json(post.comments)
    } catch (error) {
        console.error(error.message);
        return res.status(500).json('server errrrrprrrrrrrrrr')
    }
})

module.exports = router;