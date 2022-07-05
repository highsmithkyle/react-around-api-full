const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  HTTP_SUCCESS,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require('../utils/error');

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ data: user.toJSON(), token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(HTTP_SUCCESS).send(users))
    .catch(() =>
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' }),
    );
};

const getUserbyId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((users) => users.find((user) => user._id === req.params.id))
    .then((user) => {
      if (!user) {
        res.status(HTTP_NOT_FOUND).send({ message: 'User ID not found' });
        return;
      }
      res.status(HTTP_SUCCESS).send(user);
    })
    .catch(() =>
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' }),
    );
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error('The user with the provided email already exists');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((data) => res.status(201).send({ data }))
    .catch((err) => res.status(400).send(err));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('User ID not found'))
    .then((user) => res.status(HTTP_SUCCESS).send(user))
    .catch(next);
};

const updateUserProfile = (req, res) => {
  const currentUser = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.status(HTTP_SUCCESS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: ' User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else if (err.name === 'CastError') {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: 'Invalid User ID passed for updation',
        });
      } else {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
          message: 'An error has occurred on the server',
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const currentUser = req.user._id;
  const { avatar } = req.body;

  User.findOneAndUpdate(
    currentUser,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.status(HTTP_SUCCESS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else if (err.name === 'CastError') {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: 'Invalid avatar link passed for updation',
        });
      } else {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
          message: 'An error has occurred on the server',
        });
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getCurrentUser,
  getUserbyId,
  updateUserProfile,
  updateAvatar,
};

// const createUser = (req, res) => {
//   console.log('user created');
//   const { name, about, avatar, email, password } = req.body;
//   User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         throw new Error('The user with the provided email already exists');
//       } else {
//         return bcrypt.hash(password, 10);
//       }
//     })
//     .then((hash) => User.create({ name, about, avatar, email, password: hash }))
//     .then((data) => res.status(201).send({ data }))
//     .catch((err) => res.status(400).send(err));
// };

// const getCurrentUser = (req, res, next) => {
//   User.findById(req.user._id)
//     .orFail(new Error('User ID not found'))
//     .then((user) => res.status(HTTP_SUCCESS_OK).send(user))
//     .catch(next);
// };

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(HTTP_SUCCESS).send({ data: users }))
//     .catch(() =>
//       res
//         .status(HTTP_INTERNAL_SERVER_ERROR)
//         .send({ message: 'An error has occured on the server' }),
//     );
// };

// const getUserById = (req, res) => {
//   console.log(12345);
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail(() => {
//       const error = new Error('No user matches specified ID');
//       error.statusCode = HTTP_NOT_FOUND;
//       throw error;
//     })
//     .then((user) => res.send({ data: user }))
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid user ID' });
//       } else if (error.statusCode === HTTP_NOT_FOUND) {
//         res.status(HTTP_NOT_FOUND).send({ message: error.message });
//       } else {
//         res
//           .status(HTTP_INTERNAL_SERVER_ERROR)
//           .send({ message: 'An error has occured on the server' });
//       }
//     });
// };

// const updateUser = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, about },
//     { new: true, runValidators: true },
//   )
//     .orFail(() => {
//       const error = new Error('No user matches specified ID');
//       error.statusCode = HTTP_NOT_FOUND;
//       throw error;
//     })
//     .then((user) => {
//       res.send({ data: user });
//     })
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid user ID' });
//       } else if (error.statusCode === HTTP_NOT_FOUND) {
//         res.status(HTTP_NOT_FOUND).send({ message: error.message });
//       } else {
//         res
//           .status(HTTP_INTERNAL_SERVER_ERROR)
//           .send({ message: 'An error has occured on the server' });
//       }
//     });
// };

// const updateAvatar = (req, res) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { avatar },
//     { new: true, runValidators: true },
//   )
//     .orFail(() => {
//       const error = new Error('No user matches specified ID');
//       error.statusCode = HTTP_NOT_FOUND;
//       throw error;
//     })
//     .then((user) => {
//       res.send({ data: user });
//     })
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid user ID' });
//       } else if (error.statusCode === HTTP_NOT_FOUND) {
//         res.status(HTTP_NOT_FOUND).send({ message: error.message });
//       } else {
//         res
//           .status(HTTP_INTERNAL_SERVER_ERROR)
//           .send({ message: 'An error has occured on the server' });
//       }
//     });
// };
