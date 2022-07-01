const router = require('express').Router();
const { HTTP_BAD_REQUEST } = require('../utils/error');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res
    .status(HTTP_BAD_REQUEST)
    .send({ message: 'The requested resource was not found' });
});

module.exports = router;
