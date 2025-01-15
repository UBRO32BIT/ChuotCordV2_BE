const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../errors/ApiError");
const GuildInviteModel = require("../../models/guild/guildInvite.model");
const guildService = require("./guild.service");
const userService = require("./user.service");

class GuildInviteService {
    async CreateInvite({id, userId}) {
        try {
            const data = {
                guild: id,
                creator: userId,
            }
            const guildInvite = new GuildInviteModel({...data});
            return guildInvite.save().catch();
        }
        catch (error) {
            throw error;
        }
    }

    async GetInviteByCode(inviteCode) {
        try {
            const guildInvite = await GuildInviteModel.findOne({
                string: inviteCode,
            })
            .populate({
                path: 'guild',
                select: '_id name image members'
            })
            .populate({
                path: 'creator',
                select: '_id username profilePicture'
            })
            .lean();
            return guildInvite;
        }
        catch (error) {
            return null;
        }
    }

    async GetInvitesByGuildId(guildId) {
        try {
            const guildInvites = await GuildInviteModel.find({
                guild: guildId,
            })
            .populate({
                path: 'guild',
                select: '_id name image members'
            })
            .populate({
                path: 'creator',
                select: '_id username profilePicture'
            })
            .lean();
            return guildInvites;
        }
        catch (error) {
            return null;
        }
    }

    async AddMemberByInviteCode(inviteCode, userId) {
        try {
            const invite = await this.GetInviteByCode(inviteCode);
            if (!invite) {
                throw new ApiError(StatusCodes.NOT_FOUND, "Invite not found or expired");
            }
            const guildMembers = invite.guild.members
            let isGuildMember = false;
            if (Array.isArray(guildMembers)) {
                guildMembers.map((member) => {
                    console.log(member.memberId.toString() === userId)
                    if (member.memberId.toString() === userId) {
                        isGuildMember = true;
                        return;
                    }
                })
            }
            if (isGuildMember) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "The current user is already a guild member");
            }
            await guildService.AddMember(invite.guild._id, userId);
            await userService.AppendGroup(userId, invite.guild._id);
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = new GuildInviteService;