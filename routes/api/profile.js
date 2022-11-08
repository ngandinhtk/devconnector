

const express = require('express');
const router = express.Router()
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth')
const Profile = require('../../models/profile')
const User = require('../../models/User')
// import { ObjectId } from "mongodb";
const {check, validationResult} = require("express-validator");
const ObjectId = require('mongoose').Types.ObjectId; 
// var ObjectId = require('mongoose').Types.ObjectId; 
// const { findByIdAndUpdate } = require('../../models/profile');
 
// @route GET api/profile/me
// @desc test get current profile
// Private
router.get('/me', auth, async (req, res) => {
    try {
        // console.log(req.user);
        const profile = await User.findOne({user: req.user.id}).populate(['name', 'avatar'])
        // console.log(profile);
        if (!profile) {
            return res.status(400).json({msg: 'there is no profile on this user'})
        }
        res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})
// @route POST api/profile/me
// @desc test get current profile
// Private
router.post('/', [ auth,
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
], 
async (req, res) => {
    const response = validationResult(req);
    if (response.errors.length != 0) {
        return res.status(400).json({response: response.array()})
    }

    
    let {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin   
    } = req.body;

    //build profile object
    let profileFields = {}
    profileFields.user =req.user.id.trim(); 
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(', ').map(skill => skill.trim())
    }
    // res.send(profileFields)
    //build social object

    profileFields.social = {}
    if (youtube) {
    profileFields.social.youtube = youtube        
    }
    if (facebook) {
    profileFields.social.facebook = facebook        
    }
    if (twitter) {
    profileFields.social.twitter = twitter        
    }
    if (linkedin) {
    profileFields.social.linkedin = linkedin        
    }
    if (instagram) {
    profileFields.social.instagram = instagram        
    }
    try {
        let profile = await Profile.findOne({user: req.user.id})
        if(profile) {
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
            return res.json(profile)
        }
        //create
        profile = new Profile(profileFields);
        await profile.save()
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error')
    }
});


// @route POST api/profile/all
// @desc test get all profile
// Public
router.get('/all', async   (req, res) => {
    try {
        let profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error nheeeee')
    }
})
// @route POST api/profile/id
// @desc test get all profile
// private
router.get('/user', auth, async (req, res) => {
    // console.log("aaaa", req.user.id);
    // console.log(req.params);
    try {
        const profiles = await Profile.findOne({user: new ObjectId(req.user.id)}).populate('user', ['name', 'avatar'])
      
        if (!profiles) {
            return res.status(401).json('profile not found')
        }
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(401).json('profile not found')
            
        }
        res.status(500).send('server error nheeeee')
    }
})


// @route DELETE api/profile
// @desc test get all profile
// private
router.delete('/', auth, async (req, res) => {
    // console.log("aaaa", req.user.id);
    // console.log(req.params);\

    try {
        // remove profile
        await Profile.findOneAndRemove({user: new ObjectId(req.user.id)})
        // remove user
        await User.findOneAndRemove({_id: new ObjectId(req.user.id)})
        res.json('User deleted');
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(401).json('profile not found')
            
        }
        res.status(500).send('server error nheeeee')
    }
})



// @route PUT api/education
// @desc add profile education
// private
router.put('/education', 
[ auth ,
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldOfstudy', 'fieldOfstudy is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty()
]
, async (req, res)=>{
    // console.log(req);
  
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({error: error.array()})
    }
    const {
        school,
        degree,
        fieldOfstudy,
        from,
        to,
        current,
        description
    } = req.body
    const newEdu = {
        school,
        degree, 
        fieldOfstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: new ObjectId(req.user.id)});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server errror')
    }
})

// @route DELETE api/education/:exp_id
// @desc delete profile education
// private
router.delete('/education/:exp_id', 
[ auth ]
, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: new ObjectId(req.user.id)});
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        //  console.log(removeIndex);
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)
        // res.status(200).json('Xoa thanh cong')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server errror')
    }
})



// @route DELETE api/experience/:exp_id
// @desc delete profile ẽxperience
// private
router.delete('/experience/:exp_id', 
[ auth ]
, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: new ObjectId(req.user.id)});
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        //  console.log(removeIndex);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)
        // res.status(200).json('Xoa thanh cong')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server errror')
    }
})



// @route PUT api/experience
// @desc add profile ẽxperience
// private
router.put('/experience', 
[ auth ,
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'skills is required').not().isEmpty()
]
, async (req, res)=>{
    // console.log(req);
  
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({error: error.array()})
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body
    const newExp = {
        title,
        company, 
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: new ObjectId(req.user.id)});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server errror')
    }
})


// @route GET api/github/:username
// @desc get user repos from github
// public
router.get('/github/:username', async (req, res) => {
    try {
        let options = {
            url : `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
            &client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }
        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
            } 
            if (response.statusCode !== 200) {
                return res.status(400).json({msg: 'No github respone found'})
            }
            res.json(JSON.parse(body))
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error nheeeee')
    }
})
module.exports = router;