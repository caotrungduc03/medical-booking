const ApiError = require('../utils/ApiError');

const roleMiddleware = (allRoles) => (req, res, next) => {
  if (!allRoles.includes(req.user.role)) {
    return next(new ApiError('Forbidden', 403));
  }

  next();
};

module.exports = roleMiddleware;
