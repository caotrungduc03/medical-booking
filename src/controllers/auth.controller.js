const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const register = catchAsync(async (req, res) => {
  const { avatar, name, email } = req.body;
  let { password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError('Name, email and password are required', 400);
  }

  const isUserExists = await User.exists({ email });
  if (isUserExists) {
    throw new ApiError('User is already exists', 400);
  }

  const user = await User.create({ avatar, name, email, password });

  user.password = undefined;

  res.status(201).json({
    user,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError('Email or password is incorrect', 400);
  }

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new ApiError('Email or password is incorrect', 400);
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  res.status(200).json({
    accessToken,
  });
});

module.exports = {
  register,
  login,
};
