const jwt = require('jsonwebtoken');
const { User } = require('../models');

const checkCookieMiddleware = async (req, res, next) => {
  let accessToken = req.signedCookies?.tokens;
  if (!accessToken) {
    return next();
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const { userId } = payload;
    const user = await User.findById(userId).populate('roles');
    if (!user || user.isLocked === true) {
      return next();
    }

    const roles = user.roles.map((u) => u.roleIndex);

    req.user = user;
    req.roles = roles;

    next();
  } catch (err) {
    console.log(err);
    next();
  }
};

module.exports = checkCookieMiddleware;
