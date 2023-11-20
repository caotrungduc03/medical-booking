const express = require('express');
const { viewClientController } = require('../controllers');

const viewClientRouter = express.Router();

viewClientRouter.get('/register', viewClientController.register);
viewClientRouter.get('/login', viewClientController.login);
viewClientRouter.get('/forgot-password', viewClientController.forgotPassword);
viewClientRouter.get('/form', viewClientController.form);
viewClientRouter.get('/about-us', viewClientController.aboutUs);
viewClientRouter.get('/verify-email', viewClientController.verifyEmail);
viewClientRouter.get(
  '/permission-denied',
  viewClientController.permissionDenied,
);
viewClientRouter.get('/', viewClientController.home);
viewClientRouter.get('*', viewClientController.notFound);

module.exports = viewClientRouter;
