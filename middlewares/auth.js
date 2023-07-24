const { PROD, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    next(new UnauthorizedError('Необходима авторизация!'));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, PROD === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация!'));
  }

  req.user = payload;

  next();
};
