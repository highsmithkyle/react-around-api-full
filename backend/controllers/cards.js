const Card = require('../models/card');

const {
  HTTP_SUCCESS,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require('../utils/error');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HTTP_SUCCESS).send({ data: cards }))
    .catch(() => {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occured on the server' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_CREATED).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST).send({
          message: error.message,
        });
      } else {
        res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occured on the server' });
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new Error('Card ID not found'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new Error("You cannot delete someone else's card"));
      } else {
        Card.deleteOne(card).then(() => res.send({ data: card }));
      }
    })
    .catch(next);
};

const updateLike = (req, res, method) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { [method]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No card was found for specified ID');
      error.statusCode = HTTP_BAD_REQUEST;
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST).send({ message: 'Invalid card Id' });
      } else if (error.statusCode === 'HTTP_NOT_FOUND') {
        res.status(HTTP_NOT_FOUND).send({ message: error.message });
      } else {
        res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'An error occured on the server' });
      }
    });
};

const likeCard = (req, res) => updateLike(req, res, '$addToSet');
const unlikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
