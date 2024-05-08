const mongoose = require('mongoose');

const guildRoles = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: "#FFFFFF",
        required: true,
    },
    guildId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guilds',
        required: true,
    },
    canViewLog: {
        type: Boolean,
        required: true,
    },
    canEditRole: {
        type: Boolean,
        required: true,
    },
    canDeleteMessage: {
        type: Boolean,
        required: true,
    },
    canGenerateInviteLink: {
        type: Boolean,
        required: true,
    },
    canKickMember: {
        type: Boolean,
        required: true,
    },
})

module.exports = mongoose.model('GuildRoles', guildRoles);