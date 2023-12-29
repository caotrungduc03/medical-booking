const express = require('express');
const { departmentController } = require('../../controllers');
const { authMiddleware, roleMiddleware } = require('../../middlewares');

const departmentRouter = express.Router();

departmentRouter.get('/', departmentController.getDepartments);

departmentRouter.use(authMiddleware);
departmentRouter.use(roleMiddleware(['admin']));

departmentRouter.post('/', departmentController.createDepartment);

departmentRouter
  .route('/:departmentId')
  .patch(departmentController.updateDepartmentById)
  .delete(departmentController.deleteDepartmentById);

module.exports = departmentRouter;
