const express = require('express');
const { roleController } = require('../../controllers');

const roleRouter = express.Router();

roleRouter
  .route('/')
  .get(roleController.getRoles)
  .post(roleController.createRole);

roleRouter
  .route('/:roleId')
  .patch(roleController.updateRoleById)
  .delete(roleController.deleteRoleById);

module.exports = roleRouter;
