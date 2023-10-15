const express = require('express');
const { viewAdminController } = require('../../controllers');

const viewAdminRouter = express.Router();

viewAdminRouter.get('/', viewAdminController.dashboard);

module.exports = viewAdminRouter;
