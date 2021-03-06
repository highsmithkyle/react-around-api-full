const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = process.env; // nodeENV needed?

const { HTTP_SUCCESS } = require('../utils/error');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(HTTP_SUCCESS).send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new UnauthorizedError('Incorrect email or password'));
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
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
      }))
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Missing or invalid email or password'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('The users were not found'))
    .then((users) => res.status(HTTP_SUCCESS).send(users))
    .catch(next);
};

const getUserbyId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError('User ID not found'))
    .then((users) => users.find((user) => user._id === req.params.id))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User ID not found');
      }
      res.status(HTTP_SUCCESS).send(user);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('User ID not found'))
    .then((user) => res.status(HTTP_SUCCESS).send(user))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
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
    .orFail(new NotFoundError('User ID not found'))
    .then((user) => res.status(HTTP_SUCCESS).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Invalid name or description'));
      } else if (error.name === 'CastError') {
        next(new BadRequestError('Invalid user ID'));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const currentUser = req.user._id;
  // const { avatar } = req.body;
  User.findByIdAndUpdate(
    currentUser,
    { avatar: req.body.avatar.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('User ID not found'))
    .then((user) => res.status(HTTP_SUCCESS).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Invalid link'));
      } else if (error.name === 'CastError') {
        next(new BadRequestError('Invalid user ID'));
      } else {
        next(error);
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
