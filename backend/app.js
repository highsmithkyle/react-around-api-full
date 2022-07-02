const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');
const { createUser, login } = require('./controllers/users'); // add login back in
require('dotenv').config;

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());
app.use(router);

app.use((req, res, next) => {
  req.user = {
    _id: '62989027e3b3e5515cba6395',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at ${PORT}`);
  console.log(process.env.NODE_ENV);
});
