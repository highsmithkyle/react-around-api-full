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
    .then((card) => res.status(HTTP_SUCCESS).send(card))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        console.log(err);
        res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occured on the server' });
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById({ _id: id })
    .orFail(() => new Error('Card ID not found'))
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        throw new Error("Don't have permission to delete");
      }
      Card.findByIdAndRemove({ _id: id })
        .orFail()
        .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: 'Invalid Card ID',
        });
      } else {
        next(err);
      }
    });
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
