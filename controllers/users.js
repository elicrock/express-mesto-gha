const { ValidationError, CastError } = require('mongoose');
const User = require('../models/user');

const getUsers = async (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const getUserById = async (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ error: 'Переданы некорректные данные!' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера!' });
    });
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ error: 'Переданы некорректные данные при создании пользователя!' });
        return;
      }
      res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const updateUserInfo = async (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден!' });
        return;
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ error: 'Переданы некорректные данные при обновлении профиля!' });
        return;
      }
      res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден!' });
        return;
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ error: 'Переданы некорректные данные при обновлении аватара!' });
        return;
      }
      res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
