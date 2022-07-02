const router = require('express').Router();
const {
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

// router.get('/:userId', getUser); update this? or change to /me
router.get('/me, getUser');
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
