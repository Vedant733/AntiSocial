const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    following: {
        type: Array,
    },
    followers: {
        type: Array,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    }
});

module.exports = User = mongoose.model('user', userSchema);