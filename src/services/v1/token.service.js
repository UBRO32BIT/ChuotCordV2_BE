const jwt = require('jsonwebtoken');
const tokenConstants = require('../../constants/token.constants')
const TokenModel = require('../../models/auth/token.model')
const config = require('../../config/config');

const JWT_ACCESS_SECRET_KEY = config.jwt.accessSecret;
const JWT_REFRESH_SECRET_KEY = config.jwt.refreshSecret;
const ACCESS_TOKEN_EXPIRATION_MINUTES = config.jwt.accessExpirationMinutes;
const REFRESH_TOKEN_EXPIRATION_DAYS = config.jwt.refreshExpirationDays;

class TokenService {
    async GenerateToken(payload, secretKey, tokenLife) {
        return jwt.sign(payload, secretKey, {
            expiresIn: tokenLife,
        });
    }
    async GenerateAccessToken(userId, username) {
        const data = {
            sub: userId,
            username: username,
            type: tokenConstants.ACCESS_TOKEN_TYPE,
        }
        return await this.GenerateToken(
            data,
            JWT_ACCESS_SECRET_KEY, 
            ACCESS_TOKEN_EXPIRATION_MINUTES + 'm'
        )
    }
    async GenerateRefreshToken(userId, username) {
        const data = {
            sub: userId,
            username: username,
            type: tokenConstants.REFRESH_TOKEN_TYPE,
        }
        return await this.GenerateToken(
            data, 
            JWT_REFRESH_SECRET_KEY, 
            REFRESH_TOKEN_EXPIRATION_DAYS + 'd'
        )
    }
    async SaveTokenToDB(token, type, exp) {
        return await TokenModel.create({
            token: token,
            type: type,
            expires: exp.toDate(),
        });
    }
}
module.exports = new TokenService;
