const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера!' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные!' });
      }
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден!' });
      }
      return res.status(500).send({ message: 'Ошибка сервера!' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя!' });
      }
      return res.status(500).send({ message: 'Ошибка сервера!' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден!' });
      }
      if (err instanceof ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля!' });
      }
      return res.status(500).send({ ermessageror: 'Ошибка сервера!' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден!' });
      }
      if (err instanceof ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара!' });
      }
      return res.status(500).send({ message: 'Ошибка сервера!' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
