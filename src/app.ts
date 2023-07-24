import { Request, Response } from 'express';

const express = require('express');
const { db } = require('./database/mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//import routes
const category = require('./routers/product/category.route');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route
// app.use('/', indexRoute)
app.use('/api/v1/products/category', category);

// Re-Routing to it route component

// Start the server
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}...`);
});
