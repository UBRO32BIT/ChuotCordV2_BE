const { StatusCodes } = require('http-status-codes');
const logger = require('../../config/logger');
const authService = require('../../services/v1/auth.service');
const userService = require('../../services/v1/user.service');
class AuthController {
    async Login(req, res, next) {
        try {
            console.log('Cookies: ', req.cookies)
            const {username, password} = req.body;
            const loginData = await authService.Login(username, password);
            if (loginData) {
                if (!loginData.isBanned) {
                    const tokens = await authService.GenerateAuthToken(loginData);
                    //Set cookies
                    res.cookie('refreshToken', tokens.refresh.token, {httpOnly: true});
                    res.status(StatusCodes.OK).json(
                        {
                            message: 'Login successfully',
                            data: {user: loginData, tokens}
                        }
                    );
                }
                else {
                    res.status(StatusCodes.FORBIDDEN).json(
                        {
                            message: 'You have been banned from the system!',
                            data: null
                        }
                    );
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Wrong username or password!',
                    data: null
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async Register(req, res, next) {
        try {
            const {username, email, password, repeatPassword, phoneNumber } = req.body;
            if (password !== repeatPassword) {
                throw new Error('Password and repeat password do not match');
            }
            if (await userService.GetUserByUsername(username)) {
                throw new Error('Username already exist');
            }
            if (await userService.GetUserByEmail(email)) {
                throw new Error('Email already exist');
            }
            const userData = await authService.Register(username, email, password, phoneNumber);
            const tokens = await authService.GenerateAuthToken(userData);
            res.status(StatusCodes.CREATED).json({
                message: "Register successfully", 
                data: {
                    user: userData, 
                    tokens: tokens,
                } 
            });
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async SendRecoveryEmail(req, res, next) {
        try {
            const {email} = req.body;
            await authService.SendRecoveryEmail(email);
            res.status(StatusCodes.OK).json({ message: "Email sent to your email address" });
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async ResetPassword(req, res, next) {
        try {
            const {token} = req.query;
            const {newPassword} = req.body;
            await authService.ResetPassword(token, newPassword);
            res.status(StatusCodes.OK).json({ message: "Change password successfully" });
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async RefreshToken(req, res, next) {
        try {
            const data = req.user;
            const token = await authService.GenerateAccessToken(data);
            res.status(StatusCodes.OK).json(
                {
                    message: 'OK',
                    data: {token: token}
                }
            );
        }
        catch (error) {
            logger.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    async RevokeToken(req, res, next) {
        //TODO: REWOKE TOKEN FOR LOGOUT
    }
    async IsAuthenticated(req, res, next) {
        try {
            res.status(StatusCodes.OK).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new AuthController;