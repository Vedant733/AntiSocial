const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')

router.get('/', auth, async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById(id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.post('/', [
    check('email', 'Valid Email Required').isEmail(),
    check('password', 'Password Is Required').exists(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

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

module.exports = router