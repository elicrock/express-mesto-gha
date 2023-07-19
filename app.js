const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit');
const { login, createUser } = require('./controllers/users');

const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64aeab38cf0a143321ef1b2c',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
