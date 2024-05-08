const userService = require('./user.service');
const tokenService = require('./token.service');
const UserModel = require("../../models/user/user.model");
const bcrypt = require("bcrypt");
const moment = require("moment");
const config = require('../../config/config');

const JWT_ACCESS_SECRET_KEY = config.jwt.accessSecret;
const JWT_REFRESH_SECRET_KEY = config.jwt.refreshSecret;
const ACCESS_TOKEN_EXPIRATION_MINUTES = config.jwt.accessExpirationMinutes;
const REFRESH_TOKEN_EXPIRATION_DAYS = config.jwt.refreshExpirationDays;

class AuthService {
    async Register(username, email, password, phoneNumber) {
        const isUsernameExist = await userService.GetUserByUsername(username);
        if (isUsernameExist) {
            throw new ApiError(400, "User already exist");
        }
        const data = {
            username: username,
            email: email,
            password: password,
            phone_number: phoneNumber,
        }
        const result = new UserModel({...data});
        return result.save().catch();
    }
    async Login(username, password) {
        const user = await userService.GetUserByUsername(username);
        if (user) {
            const isPasswordValid = await bcrypt.compare(
                `${password}`,
                user.password
            );
            if (isPasswordValid) {
                return user;
            }
        }
        return null;
    }
    async GenerateAccessToken(user) {
        return await tokenService.GenerateToken(
            user, 
            'ACCESS', 
            JWT_ACCESS_SECRET_KEY, 
            ACCESS_TOKEN_EXPIRATION_MINUTES + 'm'
        );
    }
    async GenerateRefreshToken(user) {
        return await tokenService.GenerateToken(
            user, 
            'REFRESH', 
            JWT_REFRESH_SECRET_KEY, 
            REFRESH_TOKEN_EXPIRATION_DAYS + 'd'
        );
    }
    async GenerateAuthToken(user) {
        const accessToken = await this.GenerateAccessToken(user);
        const refreshToken = await this.GenerateRefreshToken(user);
        const accessTokenExpires = moment().add(ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
        const refreshTokenExpires = moment().add(REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
        await tokenService.SaveTokenToDB(
            refreshToken,
            'REFRESH',
            refreshTokenExpires,
        );
        
        return {
            accessToken: {
                token: accessToken,
                exp: accessTokenExpires
            },
            refresh: {
                token: refreshToken,
                exp: refreshTokenExpires
            }
        }
    }
}

module.exports = new AuthService;