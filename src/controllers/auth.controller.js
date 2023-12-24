const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { User, Role } = require('../models');
const pick = require('../utils/pick');
const response = require('../utils/response');
const { sendVerificationEmail } = require('../utils/mail');
const { generateToken } = require('../utils/token');

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

  const user = await User.create({ ...dataCreate, roles: [role._id] });
  const fullName = user.lastName + ' ' + user.firstName;

  const token = await generateToken(user);
  sendVerificationEmail(user.email, fullName, token);

  res.status(201).json(response(201, 'Thành công'));
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(400, 'Email hoặc mật khẩu nhập sai');
  }
  if (user.isLocked === true) {
    next(new ApiError(401, 'Tài khoản đã bị khoá'));
  }
  if (!user.isEmailVerified) {
    throw new ApiError(403, 'Chưa xác thực email!');
  }
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new ApiError(400, 'Email hoặc mật khẩu nhập sai');
  }

  user.lastLogin = Date.now();
  await user.save();

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

const logout = catchAsync(async (req, res, next) => {
  if (!req.signedCookies['tokens']) {
    return res.status(400).json(response(400, 'Thất bại'));
  }

  res.clearCookie('tokens');
  res.status(200).json(response(200, 'Thành công'));
});

module.exports = {
  register,
  login,
  logout,
};
