const { PROD, JWT_SECRET } = process.env;
const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера!' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
      }
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден!' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера!' });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные!' });
      }
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден!' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера!' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: `Пользователь с таким email ${email} уже зарегистрирован!` });
      }
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя!' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера!' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден!' });
      }
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля!' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера!' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден!' });
      }
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара!' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера!' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        PROD === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: true });
      res.send(token);
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
