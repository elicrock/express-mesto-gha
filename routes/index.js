const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const { validateCreateUser, validatelogin } = require('../middlewares/validation');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/signin', validatelogin, login);
router.use('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => next(new NotFoundError('Страница не найдена!')));

module.exports = router;
