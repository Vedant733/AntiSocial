const express = require('express')
const auth = require('../../middleware/auth')
const router = express.Router()
const Profile = require('../../models/Profile')
const multer = require('multer')
const fs = require('fs');
const User = require('../../models/User')
const { GetPhotoByPath } = require('../../extras/Extras')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage })

router.get('/me', auth, async (req, res) => {
    try {
        const path = 'F:/Projects/SocialMediaMERN/backend/uploads/';
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
            ['name'])
        if (!profile) {
            return res.status(400).json({ msg: 'No Profile' })
        }
        const picture = await GetPhotoByPath(profile.profilePic, null)
        res.json({ profile, profilePicture: picture })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

router.get('/pic', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
            ['name'])
        const profilePic = profile.profilePic
        if (!profilePic) return res.status(404).send('Profile Not Found')
        const filePath = 'F:/Projects/SocialMediaMERN/backend/uploads/' + profilePic;
        res.sendFile(filePath)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.post('/', auth, upload.single('file'), async (req, res) => {
    var { bio } = req.body
    const profileFields = {
        profilePic: req.file.filename,
    }
    profileFields.user = req.user.id
    if (bio) profileFields.bio = bio
    try {
        let profile = await Profile.findOne({ user: req.user.id })

        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id },
                { $set: profileFields },
                { new: true })
            return res.json(profile);
        }

        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
    }
})
// all Profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})
// profile by user id
router.get('/:user_id', async (req, res) => {
    try {
        const name = req.params.user_id;
        const user = await User.findOne({ name }).select('-password');
        const path = 'F:/Projects/SocialMediaMERN/backend/uploads/';
        const profile = await Profile.findOne({ user }).populate('user', ['name'])
        if (!profile) {
            return res.status(400).json({ msg: 'Profile Not Found' })
        }
        if (profile.profilePic) {
            const imagePath = path + profile.profilePic
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    console.error('Error reading image file:', err);
                    reject(err);
                } else {
                    const base64Image = Buffer.from(data).toString('base64');
                    res.json({ data: profile, picture: base64Image })
                }
            });
        }
        else {
            res.json(profile)
        }
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'Profile Not Found' })
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router