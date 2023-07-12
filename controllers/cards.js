const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(400).send({ error: 'Переданы некорректные данные при создании карточки!' });
      }
      return res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ error: 'Карточка с указанным id не найдена!' });
      }
      return res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(400).send({ error: 'Переданы некорректные данные для постановки лайка!' });
      }
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ error: 'Передан несуществующий id карточки!' });
      }
      return res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(400).send({ error: 'Переданы некорректные данные для снятия лайка!' });
      }
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ error: 'Передан несуществующий id карточки!' });
      }
      return res.status(500).send({ error: 'Ошибка сервера!' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
