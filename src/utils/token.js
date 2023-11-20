const jwt = require('jsonwebtoken');
const { Token } = require('../models');
const ApiError = require('./ApiError');

const generateToken = async (user) => {
  if (!user) return '';
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  await Token.create({
    token,
    user: user.id,
  });

  return token;
};

const verifyToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const verifiedToken = await Token.findOneAndDelete({ token });
    if (!verifiedToken) return;
  } catch (err) {
    console.log(err.message);
  }

  return payload;
};

module.exports = {
  generateToken,
  verifyToken,
};
