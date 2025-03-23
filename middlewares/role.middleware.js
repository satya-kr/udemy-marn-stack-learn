const AppError = require("../utils/appError");

exports.role = (...roles) => {

    return (req, res, next) => {
        // roles is an array ['user', 'admin'] 

        console.log(roles);

        if(!roles.includes(req.user.role)) {
            return next(new AppError("You don't have right permission to preform this action", 403))
        }

        next();
    }
};