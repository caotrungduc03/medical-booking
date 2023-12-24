const express = require('express');
const { authController } = require('../../controllers');

const authRouter = express.Router();

authRouter.route('/register').post(authController.register);

authRouter.route('/login').post(authController.login);

authRouter.route('/logout').get(authController.logout);

authRouter.post('/forgot-password', authController.forgotPassword);

authRouter.post('/reset-password', authController.resetPassword);

module.exports = authRouter;
