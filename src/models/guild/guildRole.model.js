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
    permissionCodes: [{
        type: String,
    }],
    displayType: {
        type: String,
        enum: ["none", "only_icon", "standard", "combined", "seperate"],
        default: "none",
    }
})

const Role = mongoose.model('GuildRoles', guildRoles);
module.exports = Role;