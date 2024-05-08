const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete')
const guildChannels = new mongoose.Schema({
    guild: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guilds',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
    }],
    accessRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuildRoles',
    }],
})

guildChannels.plugin(mongooseDelete, {deletedAt: true});

module.exports = mongoose.model('GuildChannels', guildChannels);