const messageService  = require('../../services/v1/message.service');
const { StatusCodes } = require('http-status-codes');

class MessageController {
    async GetMessagesByChannelId(req, res, next) {
        try {
            const {channelId} = req.params;
            const results = await messageService.GetAllMessagesByChannelId(channelId);
            res.status(StatusCodes.OK).json({
                message: "Message List",
                data: results,
            });
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new MessageController;