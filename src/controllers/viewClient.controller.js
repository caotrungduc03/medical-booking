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

const form = catchAsync(async (req, res) => {
  res.render('client/form');
});

const aboutUs = catchAsync(async (req, res) => {
  res.render('client/aboutUs');
});

module.exports = {
  register,
  login,
  forgotPassword,
  form,
  aboutUs,
};
