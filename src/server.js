const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const router = require('./routers/v1');
const errorMiddleware = require('./middlewares/error.middleware');
const viewAdminRouter = require('./routers/viewAdmin.route');
const viewClientRouter = require('./routers/viewClient.route');

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

// Static files
app.use('/static/', express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/v1/', router);
app.use('/admin', viewAdminRouter);
app.use('/', viewClientRouter);

// Handle error
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
