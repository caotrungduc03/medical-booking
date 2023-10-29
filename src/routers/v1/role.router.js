const express = require('express');
const { roleController } = require('../../controllers');
const { authMiddleware, roleMiddleware } = require('../../middlewares');

const roleRouter = express.Router();

roleRouter.use(authMiddleware);
roleRouter.use(roleMiddleware(['admin']));

roleRouter
  .route('/')
  .get(roleController.getRoles)
  .post(roleController.createRole);

roleRouter
  .route('/:roleId')
  .patch(roleController.updateRoleById)
  .delete(roleController.deleteRoleById);

module.exports = roleRouter;
