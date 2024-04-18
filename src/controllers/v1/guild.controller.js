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
            res.status(StatusCodes.OK).json({message: "test"});
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
    async DeleteGuild(req, res, next) {
        try {
            const id = req.params.id;
            const result = await guildService.DeleteGuild(id)
            res.status(StatusCodes.NO_CONTENT).json({message: "test"});
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new GuildController;