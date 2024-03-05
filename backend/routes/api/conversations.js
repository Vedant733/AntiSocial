const auth = require("../../middleware/auth")
const Conversation = require("../../models/Conversation")
const express = require('express');
const router = express.Router()

router.get('/', auth, async (req, res) => {
    const id = req.user.id;
    try {
        const conversations = await Conversation.find({
            members: { $in: [id] }
        })
        res.status(200).json(conversations)
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

router.post('/', auth, async (req, res) => {
    if (!req.body.senderId || !req.body.receiverId) return res.status(400).send('senderId or receiverId not found.')
    const conversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })
    try {
        const convo = await conversation.save()
        res.status(200).json(convo)
    } catch (err) {
        console.log(err)
        res.status(500)
    }
})

module.exports = router