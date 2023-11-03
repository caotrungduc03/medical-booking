const { Role } = require('../models');
const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async (req, res) => {
  res.render('admin/dashboard', {
    path: '/dashboard',
    user: req.user,
    ROLES: req.roles,
  });
});

const manageRoles = catchAsync(async (req, res) => {
  res.render('admin/manage_roles', {
    path: '/manage-roles',
    user: req.user,
    ROLES: req.roles,
  });
});

const manageUsers = catchAsync(async (req, res) => {
  const roles = await Role.find();
  res.render('admin/manage_users', {
    path: '/manage-users',
    user: req.user,
    ROLES: req.roles,
    roles,
  });
});

const manageDepartments = catchAsync(async (req, res) => {
  res.render('admin/manage_departments', {
    path: '/manage-departments',
    user: req.user,
    ROLES: req.roles,
  });
});

module.exports = {
  dashboard,
  manageRoles,
  manageUsers,
  manageDepartments,
};
