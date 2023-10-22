const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  res.render('client/register');
});

const login = catchAsync(async (req, res) => {
  res.render('client/login');
});

const forgotPassword = catchAsync(async (req, res) => {
  res.render('client/forgotPassword');
});

const dashboard = catchAsync(async (req, res) => {
  res.render('client/dashboard');
});

module.exports = {
  register,
  login,
  forgotPassword,
  dashboard,
};