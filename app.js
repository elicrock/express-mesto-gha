require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit');

const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(cookies());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
