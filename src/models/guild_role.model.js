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
    guild_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guilds',
        required: true,
    },
    can_view_log: {
        type: Boolean,
        required: true,
    },
    can_edit_role: {
        type: Boolean,
        required: true,
    },
    can_delete_message: {
        type: Boolean,
        required: true,
    },
    can_generate_invite_link: {
        type: Boolean,
        required: true,
    },
    can_kick_member: {
        type: Boolean,
        required: true,
    },
})

module.exports = mongoose.model('GuildRoles', guildRoles);