const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    members: {
        type: Array
    }
}, {
    timestamps: true
});

module.exports = Conversation = mongoose.model('conversation', conversationSchema);