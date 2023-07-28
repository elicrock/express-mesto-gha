require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookies = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const { PORT, MONGODB_URI, mongooseOptions } = require('./utils/config');

const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(cookies());
app.use(express.json());

mongoose.connect(MONGODB_URI, mongooseOptions);

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
