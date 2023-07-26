import { Response } from 'express';

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event listeners for Mongoose connection events
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err: any) => {
  console.error('Error connecting to MongoDB:', err.message);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

module.exports = {
  db,
};
