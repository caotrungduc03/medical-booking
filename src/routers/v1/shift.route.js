const express = require('express');
const { shiftController } = require('../../controllers');
const { authMiddleware, roleMiddleware } = require('../../middlewares');

const shiftRouter = express.Router();

shiftRouter.use(authMiddleware);
shiftRouter.use(roleMiddleware(['nhan-vien-to-chuc']));

shiftRouter
  .route('/')
  .get(shiftController.getShifts)
  .post(shiftController.createShift);

shiftRouter
  .route('/:shiftId')
  .patch(shiftController.updateShiftById)
  .delete(shiftController.deleteShiftById);

module.exports = shiftRouter;
