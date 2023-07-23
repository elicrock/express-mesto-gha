const jwt = require('jsonwebtoken');

const { PROD, JWT_SECRET } = process.env;
const { UNAUTHORIZED } = require('../utils/constants');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, PROD === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
