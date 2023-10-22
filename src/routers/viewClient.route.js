const express = require('express');
const { viewClientController } = require('../controllers');

const viewClientRouter = express.Router();

viewClientRouter.get('/register', viewClientController.register);
viewClientRouter.get('/login', viewClientController.login);
viewClientRouter.get('/forgot-password', viewClientController.forgotPassword);

module.exports = viewClientRouter;
