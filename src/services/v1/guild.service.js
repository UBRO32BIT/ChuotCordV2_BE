const GuildModel = require("../../models/guild.model");

class GuildService {
    async GetGuilds() {
        try {
            const guilds = await GuildModel.paginate();
            return guilds;
        }
        catch (error) {
            return null;
        }
    }
    async GetGuildById(id) {
        try {
            const guild = await GuildModel.findById(id).lean();
            return guild
        }
        catch (error) {
            return null;
        }
    }
    async CreateGuild({userId, name}) {
        const data = {
            name: name,
            owner: userId,
            members: [{
                memberId: userId,
            }]
        }
        try {
            const guild = new GuildModel({...data});
            return guild.save().catch();
        }
        catch (error) {
            throw error;
        }
    }
    async DeleteGuild(id) {
        try {
            const guild = await GuildModel.findById(id);
            const result = await guild.delete();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = new GuildService;