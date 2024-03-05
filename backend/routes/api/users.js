const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')
const { GetPhotoByPath } = require('../../extras/Extras')
const Profile = require('../../models/Profile')

router.post('/', [
    check('name', 'Valid Name Required').not().isEmpty(),
    check('email', 'Valid Email Required').isEmail(),
    check('password', 'Password with 6 or more Char').isLength({ min: 6 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User Already Exists' }] });
        }
        const uuid = crypto.randomUUID()

        const profile = new Profile({ user: uuid })

        user = new User({
            id: uuid,
            name,
            email,
            password,
            profile: profile.id
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, username: user.name });
            })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error  ');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const name = req.params.id
        console.log(name)
        const user = await User.find({ name }).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.post('/follow', auth, async (req, res) => {
    const userId = req.user.id
    const followName = req.body.username
    try {
        const user = await User.findById(userId)
        const follow = await User.findOne({ name: followName })
        if (user.following.includes(follow.id)) res.status(400).send('Already Following')
        user.following.push(follow.id)
        follow.followers.push(userId)
        await user.save()
        await follow.save()
        res.status(200).send()
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.post('/unfollow', auth, async (req, res) => {
    const userId = req.user.id
    const followName = req.body.username
    try {
        const user = await User.findById(userId)
        const follow = await User.findOne({ name: followName })
        user.following = user.following.filter(item => item !== follow.id)
        follow.followers = follow.followers.filter(item => item !== userId)
        await user.save()
        await follow.save()
        res.status(200).send()
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.get('/get/following', auth, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        const allUsers = []
        const promises = []
        user.following.forEach(item => {
            allUsers.push(User.findById(item, 'name profile').populate('profile'))
        })
        const users = await Promise.all(allUsers)
        users.forEach(item => {
            promises.push(GetPhotoByPath(item.profile.profilePic, { id: item.id, username: item.name }))
        })
        const result = await Promise.all(promises)
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.get('/get/followers', auth, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        const allUsers = []
        const promises = []
        user.followers.forEach(item => {
            allUsers.push(User.findById(item, 'name profile').populate('profile'))
        })
        const users = await Promise.all(allUsers)
        users.forEach(item => {
            promises.push(GetPhotoByPath(item.profile.profilePic, item.name))
        })
        const result = await Promise.all(promises)
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.get('/get/people', auth, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        const people = await User.find({
            _id: {
                $nin: [...user.following, userId]
            }
        }).populate('profile')
        const promises = []
        people.forEach(item => {
            promises.push(GetPhotoByPath(item.profile.profilePic, { username: item.name }))
        })
        const result = await Promise.all(promises)
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router