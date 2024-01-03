const express = require('express');
const { viewClientController } = require('../controllers');
const { checkCookieMiddleware } = require('../middlewares');

const viewClientRouter = express.Router();

viewClientRouter.get('/register', viewClientController.register);
viewClientRouter.get('/login', viewClientController.login);
viewClientRouter.get('/forgot-password', viewClientController.forgotPassword);
viewClientRouter.get('/form', checkCookieMiddleware, viewClientController.form);
viewClientRouter.get(
  '/unassign_form',
  checkCookieMiddleware,
  viewClientController.unassign_form,
);
viewClientRouter.get(
  '/about-us',
  checkCookieMiddleware,
  viewClientController.aboutUs,
);
viewClientRouter.get('/verify-email', viewClientController.verifyEmail);
viewClientRouter.get('/reset-password', viewClientController.resetPassword);
viewClientRouter.get(
  '/permission-denied',
  viewClientController.permissionDenied,
);
viewClientRouter.get('/', checkCookieMiddleware, viewClientController.home);
viewClientRouter.get('*', viewClientController.notFound);

module.exports = viewClientRouter;
