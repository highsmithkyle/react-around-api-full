const router = require('express').Router();
const {
  // login,
  getUsers,
  getCurrentUser,
  getUserById,
  // createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

// router.post('/', createUser);

module.exports = router;
