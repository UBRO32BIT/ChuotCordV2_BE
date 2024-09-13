const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');
const { GetUserById } = require('../services/v1/user.service');
const config = require('../config/config');

const JWT_ACCESS_SECRET_KEY = config.jwt.accessSecret;
const JWT_REFRESH_SECRET_KEY = config.jwt.refreshSecret;

const checkAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        //Token not found
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid access token' })
            return;
        }
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_ACCESS_SECRET_KEY)
        const userData = await GetUserById(payload.sub);
        req.user = {
            userId: payload.sub,
            data: userData,
        }
        next();
    } catch (error) {
        console.log(`[AuthMiddleware]: Invalid access token: ${error.message}`)
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'You are unauthorized to access this resource'
        })
    }
}

const checkRefreshToken = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.refreshToken) {
            const payload = jwt.verify(req.cookies.refreshToken, JWT_REFRESH_SECRET_KEY);
            //CALL VERIFY TOKEN FUNCTION LATER
            req.token = {
                userId: payload.sub,
            }
            next();
        }
        else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Refresh token not found'
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

module.exports = {
    checkAccessToken,
    checkRefreshToken,
};