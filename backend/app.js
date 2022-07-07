const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'localhost3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

app.use(cors());
app.options('*', cors());
app.use(router);

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'An error occurred on the server' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at ${PORT}`);
});

// remove hardcoded user object
// app.use((req, res, next) => {
//   req.user = {
//     _id: '62989027e3b3e5515cba6395',  // auth now handles
//   };
//   next();
// });
