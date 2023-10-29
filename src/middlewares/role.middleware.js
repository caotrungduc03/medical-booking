const ApiError = require('../utils/ApiError');

const roleMiddleware = (allRoles) => (req, res, next) => {
  const check = allRoles.every((role) => req.roles.includes(role));
  if (!check) {
    return next(new ApiError(403, 'Forbidden'));
  }

  next();
};

module.exports = roleMiddleware;
