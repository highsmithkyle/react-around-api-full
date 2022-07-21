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
router.delete('/:cardId', validateRequestAuth, validateCardId, deleteCard);
router.put('/:cardId/likes', validateRequestAuth, validateCardId, likeCard);
router.delete(
  '/:cardId/likes',
  validateRequestAuth,
  validateCardId,
  unlikeCard,
);

module.exports = router;
