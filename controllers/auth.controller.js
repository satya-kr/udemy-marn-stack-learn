const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

const signToken = async (id) => {
  const token = await jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return token;
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const user = await newUser.save();
  const token = await signToken(user._id);

  res.status(201).json({
    status: "SUCCESS",
    data: {
      user: user,
      token: token
    }
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }


  const user = await User.findOne({ email: email }).select('+password');
  const correct = await user.correctPassword(password, user.password);

  if(!user || !correct) return next(new AppError("Invalid email and password!", 401));

  const token = await signToken(user._id);

  res.status(200).json({
    status: "SUCCESS",
    data: {
      token: token
    }
  });
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if(!user) {
    return next(new AppError("There is no user with this email address!", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  // console.log(resetUrl);
  
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}`;
  
  // try {

    // not using await because want email send should process in background
    sendEmail({
      email: user.email,
      subject: 'Your Reset Password Token [Valid for 10min only]',
      message: message
    }).catch(async (err) => {
      console.error("Error sending email:", err);
  
      // If email fails, clean up reset token (optional)
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    });
    
    res.status(200).json({
      status: "SUCCESS",
      message: "reset token send to email successfully."
    });
    
  // } catch(err) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
    
  //   await user.save({ validateBeforeSave: false });

  //   res.status(500).json({
  //     status: "FAIL",
  //     message: "Error sending email."
  //   });
  // }

});

exports.resetPassword = (req, res, next) => {}