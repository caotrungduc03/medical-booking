const express = require('express');
const { medicalFormController } = require('../../controllers');
const { authMiddleware, roleMiddleware } = require('../../middlewares');

const medicalFormRouter = express.Router();

medicalFormRouter.post('/', medicalFormController.createMedicalForm);

medicalFormRouter.get(
  '/user',
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
