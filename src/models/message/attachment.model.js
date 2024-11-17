const mongoose = require('mongoose');
const { getFullUrl } = require('../../utils/file.util');

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

// Add a virtual field to get the full URL
attachments.virtual('fullUrl').get(function () {
    return getFullUrl(this.url);
});

// Ensure virtuals are included in the response JSON
attachments.set('toJSON', { virtuals: true });
attachments.set('toObject', { virtuals: true });

module.exports = mongoose.model('Attachments', attachments);