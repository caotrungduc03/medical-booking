const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { User, Role } = require('../models');
const pick = require('../utils/pick');
const response = require('../utils/response');

const register = catchAsync(async (req, res) => {
  const { confirmPassword, ...remainingData } = req.body;

  let dataCreate = pick(remainingData, [
    'firstName',
    'lastName',
    'cardId',
    'email',
    'password',
  ]);

  if (dataCreate.password !== confirmPassword) {
    throw new ApiError('Password and confirm password do not match', 400);
  }

  const isUserExists = await User.exists({ email: dataCreate.email });
  if (isUserExists) {
    throw new ApiError('User is already exists', 400);
  }

  const role = await Role.findOne({ roleIndex: 'khach-hang' });

  await User.create({ ...dataCreate, roles: [role._id] });

  res.status(201).json(response(201, 'Thành công'));
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
