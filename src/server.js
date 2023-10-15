const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routers/v1');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

const port = process.env.PORT || 8080;
const mongoURI =
  process.env.DB_URI || 'mongodb://127.0.0.1:27017/medical-booking';

(async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connect database successfully!');
  } catch (error) {
    console.log(error);
  }
})();

app.use(express.json());
app.use('/api/v1/', router);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
