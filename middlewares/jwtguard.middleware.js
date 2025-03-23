const jwt = require("jsonwebtoken");
const { promisify } = require('util');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");

exports.jwtGuard = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) return next(new AppError("unauthorized access!", 401))

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check user still exist or not
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        // the user belongs to this token done no longer exist
        return next(new AppError("unauthorized user", 401))
    }

    // check if user changed password after the token was issued
    if(freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed the password!, please login again", 401));
    }


    // GRANT ACCESS TO PROTECTED ROUTES
    req.user = freshUser;
    next();
});