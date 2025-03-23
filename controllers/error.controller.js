const { CONST_DEV, CONST_PROD } = require("../utils/constants");
const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    })
}

const sendErrorProd = (err, res) => {

    // Operationl. trusts error: send message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({ 
            status: err.status,
            message: err.message,
            ...(err.errorBucket && Object.keys(err.errorBucket).length > 0 && { errors: err.errorBucket })
        });
        // Programming error or other error so dont want to expose to client
    } else {
        // 1) log err
        // console.error("ERROR 💥:", err);
        
        res.status(500).json({
            status: "error",
            messgae: "Bhai code fat 💥 gaya :[",
        });
    }

}

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
    const valueArr = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/);
    // console.log(value);
    const message = `Duplicate field value: ${valueArr[0]} Please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((e) => ({"entity": e.path, errmsg: e.message}));
    // const errors = Object.values(err.errors).map((e) => e.message);
    // console.log("EFFFE", errors);
    const message = `Invalid input data`
    return new AppError(message, 400, errors)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "ERROR"
    err.errorBucket = []

    if(process.env.NODE_ENV === CONST_DEV) {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === CONST_PROD) {
        let error = JSON.parse(JSON.stringify(err));
        // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", error);
        
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }

}