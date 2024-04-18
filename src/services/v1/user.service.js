const UserModel = require("../../models/user.model");

class UserService {
    async GetUsers() {
        return UserModel.paginate();
    }
    async GetUserById(id) {
        try {
            const user = await UserModel.findById(id).lean();
            return user;
        } catch (error) {
            return null;
        }
    }
    async GetUserByUsername(username) {
        try {
            const user = await UserModel.findOne({ username: username }).lean();
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async GetUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email: email }).lean();
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async AppendGroup(userId, guildId) {
        try {
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { guilds: guildId } }
            );
        }
        catch (error) {
            return error;
        }
    }
}

module.exports = new UserService;