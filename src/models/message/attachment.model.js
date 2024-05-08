const mongoose = require('mongoose');

const attachments = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'video', 'text', 'code', 'file'],
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Attachments', attachments);