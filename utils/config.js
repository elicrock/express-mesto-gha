require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mestodb';
const JWT_SECRET = process.env.PROD === 'production' ? process.env.JWT_SECRET : 'dev-secret';

const mongooseOptions = {
  useNewUrlParser: true,
};

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  mongooseOptions,
};
