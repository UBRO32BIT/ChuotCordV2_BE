const { GetGuildById } = require("../services/v1/guild.service");
const { StatusCodes } = require('http-status-codes');

const AuthorizeGuild = async (req, res, next) => {
    try {
        const { userId } = req.user;
    const guild = await GetGuildById(req.params.id);
    if (guild) {
        if (guild.owner.toString() === userId.toString()) {
            req.guild = {
                data: guild,
            }
            next();
        }
        else res.status(StatusCodes.FORBIDDEN).json({message: 'Access forbidden'});
    }
    else res.status(StatusCodes.NOT_FOUND).json({message: 'Guild not found'});
    }
    catch (error) {
        logger.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

module.exports = AuthorizeGuild;