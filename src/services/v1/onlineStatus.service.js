const redisClient = require("../../database/redis.database");
const userService = require("./user.service");

class OnlineStatusService {
    async ProcessUserOnline(userId) {
        const user = await userService.GetUserById(userId);
        await this.AddUser();
        user.guilds.forEach(async guild => {
            await this.addUserToGuild();
        });
    }
    async AddUser(userId) {
        await redisClient.connect();
        await redisClient.set(`online:${userId}`, "");
        await redisClient.quit();
    }
    async RemoveUser(userId) {
        await redisClient.connect();
        await redisClient.del(`online:${userId}`)
        await redisClient.quit();
    }

    async addUserToGuild(userId, guildId) {
        await redisClient.connect();
        await redisClient.set(`onlineGroup:${guildId}:${userId}`, "");
        await redisClient.quit();
    }
    async getListMemberOnline(guildId) {
        return await redisClient.get(`onlineGroup:${guildId}`);
    }
    async removeUserFromGuild(userId, guildId) {
        await redisClient.connect();
        await redisClient.del(`onlineGroup:${guildId}:${userId}`, "");
        await redisClient.quit();
    }
}

module.exports = new OnlineStatusService;