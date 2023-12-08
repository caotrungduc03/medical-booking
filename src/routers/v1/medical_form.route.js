const express = require('express');
const { medicalFormController } = require('../../controllers');
const {
  authMiddleware,
  roleMiddleware,
  uploadMiddleware,
} = require('../../middlewares');

const medicalFormRouter = express.Router();

medicalFormRouter.post(
  '/',
  uploadMiddleware.uploadMedicalForm,
  medicalFormController.createMedicalForm,
);

medicalFormRouter.get(
  '/me',
  authMiddleware,
  medicalFormController.getMedicalFormsByUser,
);

medicalFormRouter.get(
  '/getAll',
  authMiddleware,
  roleMiddleware(['nhan-vien-phe-duyet']),
  medicalFormController.getAllMedicalForms,
);

medicalFormRouter.patch(
  '/status/:medicalFormId',
  authMiddleware,
  roleMiddleware(['nhan-vien-phe-duyet']),
  medicalFormController.updateMedicalFormStatus,
);

medicalFormRouter.get(
  '/',
  authMiddleware,
  roleMiddleware(['nhan-vien-phe-duyet']),
  medicalFormController.getMedicalForms,
);

medicalFormRouter.patch(
  '/:medicalFormId',
  authMiddleware,
  medicalFormController.updateMedicalFormByUser,
);

module.exports = medicalFormRouter;
