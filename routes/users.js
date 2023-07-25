const router = require('express').Router();

const { validateGetUserById, validateUpdateUserInfo, validateUpdateUserAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
