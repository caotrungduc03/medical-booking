const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

const authMiddleware = catchAsync(async (req, res, next) => {
  let accessToken = req.signedCookies?.tokens;

  if (!accessToken) {
    throw new ApiError(401, 'Unauthorized');
  }

  const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  const { userId } = payload;
  const user = await User.findById(userId).populate('roles');

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const roles = user.roles.map((u) => u.roleIndex);

  req.user = user;
  req.roles = roles;

  next();
});

module.exports = authMiddleware;
