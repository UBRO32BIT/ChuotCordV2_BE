const errorHandler = (error, req, res, next) => {
    console.log("hello")
    console.log(error);
    res.status(error.statusCode || 500).json({
      status: error.statusCode,
      message: error.message,
    });
}
module.exports = errorHandler;