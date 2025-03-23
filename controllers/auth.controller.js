const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
