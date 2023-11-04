const { Department } = require('../models');
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

module.exports = {
  register,
  login,
  forgotPassword,
  form,
  aboutUs,
  home,
  notFound,
  permissionDenied,
};
