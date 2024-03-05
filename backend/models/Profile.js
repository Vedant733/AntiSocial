const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    bio: {
        type: 'String',
    },
    date: {
        type: Date,
        default: Date.now
    },
    profilePic: {
        type: 'String'
    },
    following: {
        type: 'Number'
    },
    follower: {
        type: 'Number'
    }

})

module.exports = Profile = mongoose.model('profile', ProfileSchema);