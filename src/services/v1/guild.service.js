const GuildModel = require("../../models/guild/guild.model");
const GuildRoles = require("../../models/guild/guildRole.model");
const GuildPermissions = require("../../models/guild/guildPermission.model");

class GuildService {
    async GetGuilds() {
        try {
            const guilds = await GuildModel.paginate();
            return guilds;
        }
        catch (error) {
            return null;
        }
    }
    async GetGuildById(id) {
        try {
            const guild = await GuildModel.findById(id)
            .populate({
                path: 'channels',
                select: '_id name',
            })
            .populate({
                path: 'members.memberId',
                select: '_id username profilePicture onlinePresence'
            })
            .populate({
                path: 'members.roles',
                select: '_id name color permissionCodes displayType'
            })
            .lean();
            return guild
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async CreateGuild({userId, name}) {
        const data = {
            name: name,
            owner: userId,
            members: [{
                memberId: userId,
            }]
        }
        try {
            const guild = new GuildModel({...data});
            return guild.save().catch();
        }
        catch (error) {
            throw error;
        }
    }
    async AddGuildChannel(guildId, channelId) {
        try {
            await GuildModel.findOneAndUpdate(
                { _id: guildId },
                { $addToSet: { channels: channelId } }
            );
        }
        catch (error) {
            throw error;
        }
    }
    async AddMember(guildId, memberId) {
        try {
            await GuildModel.findByIdAndUpdate(
                guildId,
                { $push: { members: { memberId: memberId } } },
                { new: true, useFindAndModify: false }
            );
        }
        catch (error) {
            throw error;
        }
    }
    async RemoveMember(guildId, memberId) {
        try {
            await GuildModel.findByIdAndUpdate(
                guildId,
                { $pull: { members: memberId } }
            );
        }
        catch (error) {
            throw error;
        }
    }
    async DeleteGuild(id) {
        try {
            const guild = await GuildModel.findById(id);
            const result = await guild.delete();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = new GuildService;