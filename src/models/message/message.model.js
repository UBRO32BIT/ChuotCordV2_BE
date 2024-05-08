const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const messages = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    content: {
        type: String,
        required: true,
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
    },
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachments',
    }],
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    }
})

messages.plugin(mongooseDelete, {deletedAt: true});

module.exports = mongoose.model('Messages', messages);