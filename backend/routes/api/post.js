const express = require('express')
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const router = express.Router()
const multer = require('multer')
const fs = require('fs');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { GetPhotoByPath } = require('../../extras/Extras');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage })

router.post('/upload/', auth, upload.single('file'), async (req, res) => {
    try {
        const post = new Post({
            caption: req.body.caption,
            filename: req.file.filename,
            user: req.user.id
        });
        await post.save()
        res.status(201).send('Post Added')
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/all', auth, async (req, res) => {
    try {
        const posts = await Post.find().populate({
            path: 'user',
            select: 'name profile',
            populate: {
                path: 'profile',
                model: 'profile',
                select: 'profilePic'
            }
        });
        const path = 'F:/Projects/SocialMediaMERN/backend/uploads/';
        const promises = [];

        posts.forEach((post) => {
            const imagePath = path + post.filename;
            promises.push(new Promise(async (resolve, reject) => {
                fs.readFile(imagePath, (err, data) => {
                    if (err) {
                        console.error('Error reading image file:', err);
                        reject(err);
                    } else {
                        const base64Image = Buffer.from(data).toString('base64');
                        GetPhotoByPath(post.user.profile.profilePic, null).then(res => {
                            resolve({ image: base64Image, username: post.user.name, caption: post.caption, profile: res });
                        }).catch(() => {
                            resolve({ image: base64Image, username: post.user.name, caption: post.caption, profile: null })
                        })
                    }
                });
            }));
        });

        const imageDataArray = await Promise.all(promises);
        res.json(imageDataArray);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:user_id', auth, async (req, res) => {
    try {
        const name = req.params.user_id;
        const user = await User.findOne({ name }).select('-password');
        const path = 'F:/Projects/SocialMediaMERN/backend/uploads/';
        const posts = await Post.find({ user }).populate('user')
        const promises = [];
        posts.forEach(post => {
            const imagePath = path + post.filename;
            console.log(imagePath)
            promises.push(new Promise((resolve, reject) => {
                fs.readFile(imagePath, (err, data) => {
                    if (err) {
                        console.error('Error reading image file:', err);
                        reject(err);
                    } else {
                        const base64Image = Buffer.from(data).toString('base64');
                        resolve({ image: base64Image, data: post });
                    }
                });
            }));
        });

        const imageDataArray = await Promise.all(promises);
        res.json(imageDataArray);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get

module.exports = router