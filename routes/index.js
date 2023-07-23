const router = require('express').Router();
const { NOT_FOUND } = require('../utils/constants');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/signin', login);
router.use('/signup', createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => res.status(NOT_FOUND).send({ message: 'Страница не найдена!' }));

module.exports = router;
