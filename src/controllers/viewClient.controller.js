const { Department, User, Doctor, Shift } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { verifyToken } = require('../utils/token');

const register = catchAsync(async (req, res) => {
  res.render('client/register');
});

const login = catchAsync(async (req, res) => {
  res.render('client/login');
});

const forgotPassword = catchAsync(async (req, res) => {
  res.render('client/forgot_password');
});
const form = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('client/form', {
    departments,
    user: req.user,
  });
});

const unassign_form = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('client/unassign_form', {
    departments,
    user: req.user,
  });
});

const aboutUs = catchAsync(async (req, res) => {
  res.render('client/aboutUs', {
    user: req.user,
  });
});

const home = catchAsync(async (req, res) => {
  let departments = await Department.find();
  let doctors = await Doctor.find().populate('department');
  res.render('client/home', {
    user: req.user,
    doctors,
    departments,
  });
});

const doctorSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  let doctors = await Doctor.find().populate('department');
  let shifts = await Shift.find({ doctor: id });
  const schedule = {};
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toLocaleString().slice(0, 10);
    schedule[formattedDate] = [];
  }

  for (let shift of shifts) {
    const date = new Date(shift.date);
    const formattedDate = date.toLocaleString().slice(0, 10);
    schedule[formattedDate] = schedule[formattedDate]
      ? [...schedule[formattedDate], shift.time]
      : [shift.time];
  }

  console.log(schedule);

  res.render('client/doctor_schedule', {
    user: req.user,
    doctors,
  });
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

const resetPassword = catchAsync(async (req, res) => {
  res.render('client/reset_password');
});

module.exports = {
  register,
  login,
  forgotPassword,
  form,
  unassign_form,
  aboutUs,
  home,
  notFound,
  permissionDenied,
  verifyEmail,
  resetPassword,
  doctorSchedule,
};
