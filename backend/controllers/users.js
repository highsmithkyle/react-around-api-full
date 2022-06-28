const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const {
  HTTP_SUCCESS,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require('../utils/error');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          'The user with the provided email already exists',
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Missing or invalid email or password'));
      } else {
        next(err);
      }
    });
};

// const createUser = (req, res, next) => {
//   const { name, about, avatar, email, password } = req.body;

//   User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         throw new ConflictError('User already exists');
//       } else {
//         return bcrypt.hash(password, 10);
//       }
//     })

//     .then((hash) =>
//       User.create({
//         name,
//         about,
//         avatar,
//         email,
//         password: hash,
//       }),
//     )
//     .then((data) => res.status(201).send({ data }))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Invalid email or password'));
//       } else {
//         next(err);
//       }
//     });

//   User.create({ name, about, avatar })
//     .then((user) => res.status(HTTP_CREATED).send({ data: user }))
//     .catch((error) => {
//       if (error.name === 'ValidationError') {
//         res.status(HTTP_BAD_REQUEST).send({
//           message: error.message,
//         });
//       } else {
//         res
//           .status(HTTP_INTERNAL_SERVER_ERROR)
//           .send({ message: 'An error has occured' });
//       }
//     });
// };

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_SUCCESS).send({ data: users }))
    .catch(() =>
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occured on the server' }),
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('No user matches specified ID');
      error.statusCode = HTTP_NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid user ID' });
      } else if (error.statusCode === HTTP_NOT_FOUND) {
        res.status(HTTP_NOT_FOUND).send({ message: error.message });
      } else {
        res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occured on the server' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('No user matches specified ID');
      error.statusCode = HTTP_NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid user ID' });
      } else if (error.statusCode === HTTP_NOT_FOUND) {
        res.status(HTTP_NOT_FOUND).send({ message: error.message });
      } else {
        res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occured on the server' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('No user matches specified ID');
      error.statusCode = HTTP_NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid user ID' });
      } else if (error.statusCode === HTTP_NOT_FOUND) {
        res.status(HTTP_NOT_FOUND).send({ message: error.message });
      } else {
        res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occured on the server' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
