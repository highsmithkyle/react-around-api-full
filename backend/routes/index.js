const router = require('express').Router();
const bodyParser = require('body-parser');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middleware/auth');
const { createUser, login } = require('../controllers/users');
const { HTTP_BAD_REQUEST } = require('../utils/error');

router.use(bodyParser.json());

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth); // put below to protect other routes

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res
    .status(HTTP_BAD_REQUEST)
    .send({ message: 'The requested resource was not found' });
});

module.exports = router;
