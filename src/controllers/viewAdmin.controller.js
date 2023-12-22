const { Role, Department } = require('../models');
const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async (req, res) => {
  res.render('admin/dashboard', {
    path: '/',
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

const profile = catchAsync(async (req, res) => {
  res.render('admin/profile', {
    path: '/profile',
    user: req.user,
    ROLES: req.roles,
  });
});

const orderMedicalForm = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('admin/order_medical_form', {
    path: '/order-medical-form',
    user: req.user,
    ROLES: req.roles,
    departments,
  });
});

const statistic = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('admin/statistic', {
    path: '/statistic',
    user: req.user,
    ROLES: req.roles,
    departments,
  });
});

const manageOrders = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('admin/manage_orders', {
    path: '/manage-orders',
    user: req.user,
    ROLES: req.roles,
    departments,
  });
});

const historyOrders = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('admin/history_orders', {
    path: '/history-orders',
    user: req.user,
    ROLES: req.roles,
    departments,
  });
});

const manageDoctors = catchAsync(async (req, res) => {
  const departments = await Department.find();

  res.render('admin/manage_doctors', {
    path: '/manage-doctors',
    user: req.user,
    ROLES: req.roles,
    departments,
  });
});

module.exports = {
  dashboard,
  manageRoles,
  manageUsers,
  manageDepartments,
  profile,
  orderMedicalForm,
  statistic,
  manageOrders,
  historyOrders,
  manageDoctors,
};
