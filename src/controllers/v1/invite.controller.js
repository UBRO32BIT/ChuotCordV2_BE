class InviteController {
    async CreateInvite(req, res, next) {
        try {
            res.status(StatusCodes.CREATED).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async AddMember(req, res, next) {
        try {
            res.status(StatusCodes.OK).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async GetInviteById(req, res, next) {
        try {
            res.status(StatusCodes.OK).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
    async DeleteInvite(req, res, next) {
        try {
            res.status(StatusCodes.NO_CONTENT).json({message: "test"});
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}

module.exports = new InviteController;