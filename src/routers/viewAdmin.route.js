const express = require('express');
const { viewAdminController } = require('../controllers');
const { authMiddleware, roleMiddleware } = require('../middlewares');

const viewAdminRouter = express.Router();

viewAdminRouter.get(
  '/manage-users',
  authMiddleware,
  roleMiddleware(['admin']),
  viewAdminController.manageUsers,
);
viewAdminRouter.get(
  '/manage-roles',
  authMiddleware,
  roleMiddleware(['admin']),
  viewAdminController.manageRoles,
);
viewAdminRouter.get(
  '/manage-departments',
  authMiddleware,
  roleMiddleware(['admin']),
  viewAdminController.manageDepartments,
);
viewAdminRouter.get('/profile', authMiddleware, viewAdminController.profile);
viewAdminRouter.get(
  '/order-medical-form',
  authMiddleware,
  viewAdminController.orderMedicalForm,
);
viewAdminRouter.get(
  '/statistic',
  authMiddleware,
  roleMiddleware(['nhan-vien-phe-duyet']),
  viewAdminController.statistic,
);
viewAdminRouter.get(
  '/manage-orders',
  authMiddleware,
  roleMiddleware(['nhan-vien-phe-duyet']),
  viewAdminController.manageOrders,
);
viewAdminRouter.get(
  '/history-orders',
  authMiddleware,
  viewAdminController.historyOrders,
);
viewAdminRouter.get('/', authMiddleware, viewAdminController.dashboard);

module.exports = viewAdminRouter;
