const { Role } = require('../models');
const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async (req, res) => {
  res.render('admin/dashboard', {
    user: req.user,
  });
});

const manageRoles = catchAsync(async (req, res) => {
  res.render('admin/manage_roles', {
    user: req.user,
  });
});

const manageUsers = catchAsync(async (req, res) => {
  const roles = await Role.find();
  res.render('admin/manage_users', {
    user: req.user,
    roles,
  });
});

module.exports = {
  dashboard,
  manageRoles,
  manageUsers,
};
