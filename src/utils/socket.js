const { Server } = require('socket.io');
const redisClient = require('../database/redis.database');
const onlineStatusService = require('../services/v1/onlineStatus.service');
const config = require('../config/config');
const jwt = require("jsonwebtoken");
const messageService = require('../services/v1/message.service');

let socket;

const createSocket = (httpServer) => {
    socket = new Server(httpServer, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"],
        }
    });

    socket.use((socket, next) => {
        const header = socket.handshake.auth.token;
        if (!header) {
          return next(new Error("no token"));
        }
      
        if (!header.startsWith("Bearer ")) {
          return next(new Error("invalid token"));
        }
      
        const token = header.substring(7);
      
        jwt.verify(token, config.jwt.accessSecret, (err, decoded) => {
          if (err) {
            console.log(`[SOCKET]: Invalid access token: ${err.message}`)
            socket.disconnect();
            return;
            //return next(new Error("invalid token"));
          }
          socket.userId = decoded.sub;
          next();
        });
    });

    socket.on("connection", async (socket) => {
        console.log(`[SOCKET]: User with ID ${socket.userId} connected`);
        await onlineStatusService.ProcessUserOnline(socket.userId);

        socket.on("user_connect_channel", async (data) => {
            if (data && data.channelId) {
                socket.join(data.channelId);
                console.log(`[SOCKET]: User ${socket.userId} connected channel ${data.channelId}`);
            }
        })
        
        socket.on("chat", async (data) => {
            try {
                if (data && data.channelId && data.message) {
                    data.userId = socket.userId;
                    const message = await messageService.AddMessage(data);
                    socket.nsp.to(message.channelId.toString()).emit("chat_received", {
                        userId: message.sender,
                        content: message.content,
                        replyId: message.replyId,
                        attachments: message.attachments,
                        timestamp: message.timestamp,
                    });
                }
            }
            catch (error) {
                console.error(error.message);
            }
        })

        socket.on("user_typing", async (data) => {
            //if (data && data.)
        })

        socket.on("user_done_typing", async (data) => {
            //if (data && data.)
        })

        socket.on("disconnect", async (data) => {
            console.log(`[SOCKET]: User disconnected ${socket.userId}`);
            await onlineStatusService.RemoveUser(socket.userId);
        })
    })
}

module.exports = {
    socket,
    createSocket,
};