const userService  = require('../../services/v1/user.service');
const { StatusCodes } = require('http-status-codes');
class UserController {
    async GetUsers(req, res, next) {
        try {
            const results = await userService.GetUsers();
            res.status(StatusCodes.OK).json({
                message: 'Query User',    
                data: results
            })
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async GetGroupsByUserId(req, res, next) {
        try {
            const {userId} = req.user;
            console.log(`[UserController]: Start getting groups by user id ${userId}`);
            const results = await userService.GetGuildsByUserId(userId);
            res.status(StatusCodes.OK).json({
                message: 'Query user',
                data: results,
            })
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async GetUserById(req, res, next) {
        try {
            const { id } = req.params;
            if (id) {
                const result = await userService.GetUserById(id);
                if (result) {
                    res.status(StatusCodes.OK).json({
                        message: "User found",
                        data: result
                    });
                }
                else res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }
            else res.status(StatusCodes.BAD_REQUEST).json({message: "User ID is required"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async UpdateUser(req, res, next) {
        try {
            const {userId} = req.user;
            const {
                phoneNumber, 
                profilePicture
            } = req.body;
            const data = {
                phoneNumber,
                profilePicture
            }

            const result = await userService.UpdateUser(userId, data);
            res.status(StatusCodes.OK).json({
                message: "Update successfully",
                data: result,
            });
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async BanUser(req, res, next) {
        try {
            res.status(StatusCodes.NO_CONTENT).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new UserController;