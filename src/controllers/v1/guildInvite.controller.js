const guildInviteService = require("../../services/v1/guildInvite.service");
const { StatusCodes } = require('http-status-codes');

class InviteController {
    async CreateInvite(req, res, next) {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Guild ID is required",
                })
            }
            else {
                const guildInvite = await guildInviteService.CreateInvite({userId, id});
                res.status(StatusCodes.CREATED).json({
                    message: "Guild invite created",
                    data: guildInvite,
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async AddMemberByInviteCode(req, res, next) {
        try {
            const { inviteCode } = req.params;
            const { userId } = req.user;
            await guildInviteService.AddMemberByInviteCode(inviteCode, userId);
            res.status(StatusCodes.OK).json({
                message: "Joined successfully",
                data: null,
            });
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async GetInviteByCode(req, res, next) {
        try {
            const { inviteCode } = req.params;
            const guildInvite = await guildInviteService.GetInviteByCode(inviteCode);
            if (guildInvite) {
                res.status(StatusCodes.OK).json({
                    message: "Invite found",
                    data: guildInvite,
                });
            }
            else {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: "Invite not found or expired",
                    data: null
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }

    async GetInvitesByGuildId(req, res, next) {
        try {
            const { id } = req.params;
            const guildInvites = await guildInviteService.GetInvitesByGuildId(id);
            res.status(StatusCodes.OK).json({
                message: "Invite found",
                data: guildInvites,
            });
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async DeleteInvite(req, res, next) {
        try {
            res.status(StatusCodes.NO_CONTENT).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new InviteController;