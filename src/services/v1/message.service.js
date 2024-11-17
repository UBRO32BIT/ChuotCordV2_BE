const MessageModel = require("../../models/message/message.model");
const AttachmentModel = require("../../models/message/attachment.model");
const { getSocket } = require("../../utils/socket");

class MessageService {
    async GetAllMessagesByChannelId(channelId) {
        try {
            const messages = await MessageModel.find({
                channelId: channelId,
            })
            .populate([
                {
                    path: 'sender',
                    select: '_id username profilePicture',
                },
                {
                    path: 'attachments',
                    select: '_id type url fullUrl',
                }
            ]);
            return messages;
        }
        catch (error) {
            return null;
        }
    }

    async AddMessage(data) {
        try {
            // Check if attachments are provided, and ensure it's an array
            const attachments = Array.isArray(data.attachments) 
                ? await Promise.all(data.attachments.map(async (attachment) => {
                    const newAttachment = new AttachmentModel(attachment);
                    await newAttachment.save();
                    return newAttachment._id;
                }))
                : []; // If no attachments, set it to an empty array
    
            const processedData = {
                sender: data.userId,
                content: data.message,
                replyId: data.replyId,
                attachments, // Either populated with IDs or remains an empty array
                channelId: data.channelId,
            };
    
            const message = new MessageModel({ ...processedData });
            const savedMessage = await message.save();
            const result = await savedMessage.populate([
                {
                    path: 'sender',
                    select: '_id username profilePicture',
                },
                {
                    path: 'attachments',
                    select: '_id type url fullUrl',
                }
            ]);
    
            // Emit socket event to users in the same channel
            const socket = getSocket();
            socket.to(data.channelId).emit("chat_received", result);

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessageService;