const express = require('express');
const Message = require('../../models/Message');
const auth = require('../../middleware/auth');
const Conversation = require('../../models/Conversation');
const router = express.Router()

router.post('/', auth, async (req, res) => {
    const { conversationId, text } = req.body
    if (!conversationId || !text) return res.status(400).send('Invalid Request Body')
    try {
        const message = new Message({ conversationId, sender: req.user.id, text })
        const msg = await message.save()
        res.status(200).json(msg)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// Get all messages by Second Member Id
router.post('/full', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const friendId = req.body.friendId;
        if (!friendId) return res.status(400).send('friendId Not Found.')
        let conversation = await Conversation.findOne({
            members: { $all: [id, friendId] }
        })
        if (conversation === null) {
            conversation = new Conversation({
                members: [id, friendId]
            })
            conversation = await conversation.save()
        }
        const conversationId = conversation._id
        const chat = await Message.find({ conversationId }, { text: 1, sender: 1, createdAt: 1 }).sort({ createdAt: -1 })
        res.status(200).json({ chat, conversationId })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router