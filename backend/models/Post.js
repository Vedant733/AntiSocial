const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    filename: {
        type: String
    },
    caption: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = Post = mongoose.model('Post', PostSchema, 'Post') 