const express = require('express');
const { viewAdminController } = require('../controllers');
const { authMiddleware, roleMiddleware } = require('../middlewares');

const viewAdminRouter = express.Router();

viewAdminRouter.get(
  '/manage-roles',
  authMiddleware,
  roleMiddleware(['admin']),
  viewAdminController.manageRoles,
);
viewAdminRouter.get('/', authMiddleware, viewAdminController.dashboard);

module.exports = viewAdminRouter;
