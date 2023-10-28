const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async (req, res) => {
  res.render('admin/dashboard');
});

const manageRoles = catchAsync(async (req, res) => {
  res.render('admin/manage_roles');
});

module.exports = {
  dashboard,
  manageRoles,
};
