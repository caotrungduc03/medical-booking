const express = require('express');
const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const roleRouter = require('./role.router');
const departmentRouter = require('./department.router');
const medicalFormRouter = require('./medical_form.route');
const doctorRouter = require('./doctor.route');

const router = express.Router();

const routes = [
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/roles',
    route: roleRouter,
  },
  {
    path: '/departments',
    route: departmentRouter,
  },
  {
    path: '/medical-forms',
    route: medicalFormRouter,
  },
  {
    path: '/doctors',
    route: doctorRouter,
  },
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
