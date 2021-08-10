const { setRandomFallback } = require('bcryptjs');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { profile_url } = require('gravatar');
// @route GET api/profile/me
// @desc  Get current users profile
// @acess Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).send('There is no profile for the user');
        }

        return res.send(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route POST api/profile
// @desc  Create or update user profile
// @acess Private
router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills are required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        status,
        // spread the rest of the fields we don't need to check
        ...rest
    } = req.body;

    // built profile objet
    const profileFields = {};

    profileFields.user = req.user.id;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // built social object
    profileFields.social = {}

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({
            user: req.user.id,
        });
        console.log(profile);

        if (profile) {
            // update
            profile = await Profile.findOneAndUpdate({
                user: req.user.id,
            }, {
                $set: profileFields
            }, {
                new: true,
            })

            return res.json(profile);
        }

        profile = new Profile(profileFields);

        await profile.save();

        return res.status(200).json(profile);

    } catch (err) {
        console.error(err);
        return res.status(500).send('error')
    }
})

// @route GET api/profile
// @desc  GEt all profules
// @acess Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route DELETE api/user/:user_id
// @desc  GEt get profile by user id
// @acess Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'there is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'there is no profile for this user' });
        }
        return res.status(500).send('Server Error');
    }
})

// @route GET api/profile
// @desc  delete profile, user & postrs
// @acess Private
router.delete('/', auth, async (req, res) => {
    try {
        // remove user posts
        await Post.deleteMany({ user: req.user.id })
        //remove profile 
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'Profile deleted' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
})

// @route PUT api/profile/experience
// @desc  add profile experience
// @acess Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description }

    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        })

        profile.experience.unshift(newExp);

        await profile.save();

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route DELETE api/profile/experience/:exp_id
// @desc  delete experience from profile
// @acess Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });

        //get remove index
        const removeIndex = profile.experience.map(item => item._id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        return res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route PUT api/profile/education
// @desc  add profile education
// @acess Private
router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy date is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    const newedu = { school, degree, fieldofstudy, from, to, current, description }

    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        })

        profile.education.unshift(newedu);

        await profile.save();

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route DELETE api/profile/education/:edu_id
// @desc  delete education from profile
// @acess Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });

        //get remove index
        const removeIndex = profile.education.map(item => item._id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        return res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile/github/:username
// @desc  get users repos from github
// @acess Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'nodejs'
            }
        }

        request(options, (err, response, body) => {
            if (err) {
                console.log(err);
            }

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }

            res.json(JSON.parse(body));
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');
    }
})

module.exports = router;