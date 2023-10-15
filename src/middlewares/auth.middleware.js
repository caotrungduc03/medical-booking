const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

const extractTokenFromHeader = (req) => {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

const authMiddleware = catchAsync(async (req, res, next) => {
  const accessToken = extractTokenFromHeader(req);
  if (!accessToken) {
    throw new ApiError('Unauthorized', 401);
  }

  const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  const { userId } = payload;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError('Unauthorized', 401);
  }

  req.user = user;

  next();
});

module.exports = authMiddleware;
