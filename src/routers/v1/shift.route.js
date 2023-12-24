const express = require('express');
const { shiftController } = require('../../controllers');
const { authMiddleware, roleMiddleware } = require('../../middlewares');

const shiftRouter = express.Router();

shiftRouter.get('/', shiftController.getShifts);

shiftRouter.use(authMiddleware);
shiftRouter.use(roleMiddleware(['nhan-vien-to-chuc']));

shiftRouter.post('/', shiftController.createShift);

shiftRouter
  .route('/:shiftId')
  .patch(shiftController.updateShiftById)
  .delete(shiftController.deleteShiftById);

module.exports = shiftRouter;
