const UserModel = require("../../models/user/user.model");
const GuildModel = require("../../models/guild/guild.model");
const emailService = require('../../services/v1/email.service');
const redisClient = require("../../database/redis.database");
const bcrypt = require('bcrypt');

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
            });
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
            const user = await UserModel.findById(userId).select('guilds -_id');
            if (!user) return null;
    
            const guilds = await GuildModel.aggregate([
                { $match: { _id: { $in: user.guilds } } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        image: 1,
                        memberCounts: { $size: "$members" }, // Count the members array
                    },
                },
            ]);
    
            return guilds;
        } catch (error) {
            console.error(error);
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
    
            // Update other fields if provided
            if (data.profilePicture) {
                user.profilePicture = data.profilePicture;
            }
            if (data.phoneNumber) {
                user.phoneNumber = data.phoneNumber;
            }

            if (data.onlinePresence) {
                user.onlinePresence = data.onlinePresence;
            }

            user.profileDescription = data.profileDescription;

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
                throw new Error('Old password is incorrect');
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
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            if (user.isEmailVerified) {
                throw new Error('Email is already verified');
            }
    
            const otpKey = `email-verification:${userId}`; // Key for OTP
            const cooldownKey = `email-verification-cooldown:${userId}`; // Key for cooldown
    
            // Check if the user is in cooldown
            const cooldown = await redisClient.get(cooldownKey);
            if (cooldown) {
                throw new Error('You must wait 30 seconds before requesting a new OTP');
            }
    
            // Check if an OTP already exists in cache
            let otp = await redisClient.get(otpKey);
    
            if (!otp) {
                // Generate a new OTP if none exists
                otp = Math.floor(100000 + Math.random() * 900000).toString();
    
                // Store OTP in Redis with a 10-minute expiration
                await redisClient.setEx(otpKey, 600, otp);
            }
    
            // Set a cooldown of 30 seconds
            await redisClient.setEx(cooldownKey, 30, 'true');
    
            // Send email with OTP
            await emailService.SendEmail(
                user.email,
                'Verify Your Email',
                `<p>Hello ${user.username},</p><p>Your verification code is: <b>${otp}</b></p>`
            );
    
            return { message: 'Verification email sent successfully' };
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }

    async VerifyEmail(userId, otp) {
        try {
            const otpKey = `email-verification:${userId}`;
            const storedOtp = await redisClient.get(otpKey);

            if (!storedOtp) {
                throw new Error('OTP expired or invalid');
            }

            if (storedOtp !== otp) {
                throw new Error('Invalid OTP');
            }

            // Mark email as verified in the database
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.isEmailVerified = true;
            await user.save();

            // Delete OTP from Redis after successful verification
            await redisClient.del(otpKey);

            return { message: 'Email verified successfully' };
        } catch (error) {
            console.error('Error verifying email:', error);
            throw error;
        }
    }
}

module.exports = new UserService;