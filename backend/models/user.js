const mongoose = require('mongoose');
const { urlRegExp } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'URL required'],
    validate: {
      validator: (v) => urlRegExp.isURL(v),
      message: 'Valid URL Required',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
