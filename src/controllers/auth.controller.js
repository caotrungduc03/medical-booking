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
    throw new ApiError(400, 'Xác nhận mật khẩu không trùng khớp!');
  }

  const isUserExists = await User.exists({ email: dataCreate.email });
  if (isUserExists) {
    throw new ApiError(400, 'Email đã tồn tại');
  }

  const role = await Role.findOne({ roleIndex: 'khach-hang' });

  await User.create({ ...dataCreate, roles: [role._id] });

  res.status(201).json(response(201, 'Thành công'));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(400, 'Email hoặc mật khẩu nhập sai');
  }
  // if (!user.isEmailVerified) {
  //   throw new ApiError(403, 'Chưa xác thực email!', );
  // }
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new ApiError(400, 'Email hoặc mật khẩu nhập sai');
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

  res.cookie('tokens', accessToken, { signed: true, httpOnly: true });

  res.status(200).json(response(200, 'Thành công', accessToken));
});

module.exports = {
  register,
  login,
};
