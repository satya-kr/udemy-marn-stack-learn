const { CONST_DEV, CONST_PROD } = require("../utils/constants");

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
            message: err.message
        });
    // Programming error or other error so dont want to expose to client
    } else {
        // 1) log err
        console.error("ERROR:", err);

        res.status(500).json({
            status: "error",
            messgae: "Bhai code fat gaya :["
        });
    }

}

const handleCastErrorDB = (err) => {

}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "ERROR"

    if(process.env.NODE_ENV === CONST_DEV) {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === CONST_PROD) {

        let error = {...err}; 

        if(err.name === 'CastError') {
            err = handleCastErrorDB(err);
        }

        sendErrorProd(err, res);
    }

}