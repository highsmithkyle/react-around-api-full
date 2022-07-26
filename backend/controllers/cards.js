const Card = require('../models/card');
const { HTTP_SUCCESS } = require('../utils/error');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Cards were not found'))
    .then((cards) => res.status(HTTP_SUCCESS).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_SUCCESS).send(card))
    .catch((error) => {
      if (error.name === 'ValidatorError') {
        next(new BadRequestError('Invalid name or link'));
      } else {
        next(error);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Card ID not found'))
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        throw new Error('Missing permission to delete');
      }

      Card.deleteOne(card).then(() => res.status(HTTP_SUCCESS).send(card));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    { _id: cardId },
    { $addToSet: { likes: currentUser } },
    { new: true },
  )
    .orFail(new NotFoundError('Card ID not found'))
    .then((card) => res.status(HTTP_SUCCESS).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      } else {
        next(error);
      }
    });
};

const unlikeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: currentUser } },
    { new: true },
  )
    .orFail(new NotFoundError('Card ID not found'))
    .then((card) => res.status(HTTP_SUCCESS).send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
