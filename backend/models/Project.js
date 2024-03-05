const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: 'String',
        required: true
    },
    description: {
        type: 'String',
        required: true
    },
    requirements: {
        type: ['String'],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: 'String'
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        text: {
            type: 'String',
            required: true
        },
        avatar: {
            type: 'String'
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }],
    date: {
        type: Date,
        default: Date.now,
    }
})

module.exports = Project = mongoose.model('project', ProjectSchema);