const express = require('express');
const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const roleRouter = require('./role.router');

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
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
