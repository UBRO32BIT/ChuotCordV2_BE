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
    async GetGuildsByUserId(userId) {
        try {
            const user = await UserModel.findById(userId).select('guilds -_id').populate({
                path: 'guilds',
                select: '_id name image', // Select the fields you want to populate
            });
            return user.guilds;
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
    async RemoveGroup(userId, guildId) {
        try {
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $pull: { guilds: guildId } }
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
    
            if (data.password) {
                // If updating password, hash it before saving
                const saltRounds = 10;
                data.password = await bcrypt.hash(data.password, saltRounds);
            }
    
            // Update other fields if provided
            if (data.profilePicture) {
                user.profilePicture = data.profilePicture;
            }
            if (data.phoneNumber) {
                user.phoneNumber = data.phoneNumber;
            }

            await user.save();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async ChangePassword(userId, oldPassword, newPassword) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(
                `${oldPassword}`,
                user.password
            );
            if (!isPasswordValid) {
                return new Error('Old password is incorrect');
            }

            if (newPassword) {
                user.password = newPassword;
                await user.save();
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async ResetPassword(userId, newPassword) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (newPassword) {
            user.password = newPassword;
            await user.save();
        }
    }
    async SendVerifyEmail(userId) {

    }
    async VerifyEmail(verifyToken) {

    }
}

module.exports = new UserService;