const UserModel = require("../../models/user/user.model");

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
            const user = await UserModel.findOne({ username: username })
            .populate({
                path: 'guilds',
                select: '_id name image', // Select the fields you want to populate
            })
            .lean();
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
    async UpdateUser(userId, data) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            if (updates.password) {
                // If updating password, hash it before saving
                const saltRounds = 10;
                updates.password = await bcrypt.hash(updates.password, saltRounds);
            }
    
            // Update other fields if provided
            if (updates.profilePicture) {
                user.profilePicture = updates.profilePicture;
            }
            if (updates.phoneNumber) {
                user.phoneNumber = updates.phoneNumber;
            }
        }
        catch (error) {

        }
    }
}

module.exports = new UserService;