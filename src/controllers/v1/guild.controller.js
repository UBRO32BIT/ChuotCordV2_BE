const { StatusCodes } = require('http-status-codes');
const logger = require('../../config/logger');
const guildService = require('../../services/v1/guild.service');
const userService = require('../../services/v1/user.service');

class GuildController {
    async GetGuilds(req, res, next) {
        try {
            const guilds = await guildService.GetGuilds();
            res.status(StatusCodes.OK).json({
                message: "Guild List",
                data: guilds,
            });
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async GetGuildById(req, res, next) {
        try {
            const { id } = req.params;
            const guild = await guildService.GetGuildById(id);
            if (guild) {
                res.status(StatusCodes.OK).json({
                    message: "Guild found",
                    data: guild
                });
            }
            else {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: "Guild not found",
                    data: null
                });
            }
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async CreateGuild(req, res, next) {
        try {
            const { userId } = req.user;
            const { name } = req.body;
            if (!name) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Guild name is required"
                })
            }
            else {
                const data = await guildService.CreateGuild({
                    userId,
                    name
                });
                await userService.AppendGroup(userId, data._id);
                res.status(StatusCodes.CREATED).json({
                    message: "Guild created",
                    data: data,
                });
            }
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async UpdateGuild(req, res, next) {
        try {
            res.status(StatusCodes.OK).json({message: "test"});
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async RemoveMemberFromGuild(req, res, next) {
        try {
            const { memberId } = req.params;
            const id = req.params.id;
            logger.info(`[GuildController]: Start removing user ${memberId} from guild ${id}`);
            await guildService.RemoveMember(id, memberId);
            await userService.RemoveGroup(memberId, id);
            res.status(StatusCodes.NO_CONTENT).json({message: "Member removed"});
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async DeleteGuild(req, res, next) {
        try {
            const { userId } = req.user;
            const id = req.params.id;
            logger.info(`[GuildController]: Start deleting guild with id ${id}`)
            await guildService.DeleteGuild(id)
            await userService.RemoveGroup(userId, id);
            res.status(StatusCodes.NO_CONTENT).json({message: "Guild deleted"});
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new GuildController;