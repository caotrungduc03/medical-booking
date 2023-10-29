const ApiError = require('../utils/ApiError');

const roleMiddleware = (allRoles) => (req, res, next) => {
  if (!allRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden'));
  }

  next();
};

module.exports = roleMiddleware;
