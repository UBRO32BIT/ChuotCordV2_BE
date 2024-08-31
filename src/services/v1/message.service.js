const MessageModel = require("../../models/message/message.model");

class MessageService {
    async GetAllMessagesByChannelId(channelId) {
        try {
            const messages = await MessageModel.find({
                channelId: channelId,
            })
            .populate({
                path: 'sender',
                select: '_id username profilePicture'
            });
            return messages;
        }
        catch (error) {
            return null;
        }
    }

    async AddMessage(data) {
        try {
            const processedData = {
                sender: data.userId,
                content: data.message,
                replyId: data.replyId,
                attachments: data.attachments,
                channelId: data.channelId,
            }
            const message = new MessageModel({...processedData});
            return (await message.save().catch()).populate({
                path: 'sender',
                select: '_id username profilePicture'
            });
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = new MessageService;