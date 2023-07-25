import express from 'express';

const customerCtrl = require('../../controllers/customer/customer.controller');

const route = express.Router();

route.post('/registration', customerCtrl.createCustomerAccounnt);

module.exports = route;