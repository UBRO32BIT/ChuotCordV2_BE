const { GetGuildById } = require("../services/v1/guild.service");
const { StatusCodes } = require('http-status-codes');

const AuthorizeGuild = async (req, res, next) => {
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

module.exports = AuthorizeGuild;