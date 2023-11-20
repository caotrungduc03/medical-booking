const { Department, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { verifyToken } = require('../utils/token');

const register = catchAsync(async (req, res) => {
  res.render('client/register');
});

const login = catchAsync(async (req, res) => {
  res.render('client/login');
});

const forgotPassword = catchAsync(async (req, res) => {
  res.render('client/forgotPassword');
});

const form = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('client/form', { departments });
});

const aboutUs = catchAsync(async (req, res) => {
  res.render('client/aboutUs');
});

const home = catchAsync(async (req, res) => {
  res.render('client/home');
});

const notFound = catchAsync(async (req, res) => {
  res.render('client/not_found');
});

const permissionDenied = catchAsync(async (req, res) => {
  res.render('client/permission_denied');
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  const url = process.env.BASE_URL;
  const payload = await verifyToken(token);
  const isSuccess = !!payload;

  if (isSuccess) {
    await User.findByIdAndUpdate(payload.userId, { isEmailVerified: true });
  }

  res.render('client/verify_email', { url, isSuccess });
});

module.exports = {
  register,
  login,
  forgotPassword,
  form,
  aboutUs,
  home,
  notFound,
  permissionDenied,
  verifyEmail,
};
