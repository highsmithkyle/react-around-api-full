const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

const {
  validateRequestAuth,
  validateCard,
  validateCardId,
} = require('../middleware/validation');

router.get('/', validateRequestAuth, getCards);
router.post('/', validateRequestAuth, validateCard, createCard);
router.delete('/:cardId', validateRequestAuth, deleteCard); //validateCardId
router.put('/:cardId/likes', validateRequestAuth, likeCard); //validateCardId,
router.delete('/:cardId/likes', validateRequestAuth, unlikeCard); //validateCardId,

module.exports = router;
