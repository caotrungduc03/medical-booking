const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async (req, res) => {
  res.render('admin/dashboard', {
    user: req.user,
    roles: req.roles,
  });
});

const manageRoles = catchAsync(async (req, res) => {
  res.render('admin/manage_roles', {
    user: req.user,
    roles: req.roles,
  });
});

module.exports = {
  dashboard,
  manageRoles,
};
