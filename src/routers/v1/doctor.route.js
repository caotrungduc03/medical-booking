const express = require('express');
const { doctorController } = require('../../controllers');
const {
  authMiddleware,
  roleMiddleware,
  uploadMiddleware,
} = require('../../middlewares');

const doctorRouter = express.Router();

doctorRouter.get('/', doctorController.getDoctors);

doctorRouter.use(authMiddleware);
doctorRouter.use(roleMiddleware(['admin']));

doctorRouter.post(
  '/',
  uploadMiddleware.uploadAvatar,
  doctorController.createDoctor,
);

doctorRouter
  .route('/:doctorId')
  .patch(doctorController.updateDoctorById)
  .delete(doctorController.deleteDoctorById);

module.exports = doctorRouter;
