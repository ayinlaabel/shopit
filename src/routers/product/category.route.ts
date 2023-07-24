import express from 'express';
import { category } from '../../interface';

const categoryCtrl = require('../../controllers/products/category.controller');

const route = express.Router();

route.get('/', categoryCtrl.getAllCategories);
route.post('/', categoryCtrl.createCategory);
route.get('/:id', categoryCtrl.getSingleCategory);
route.put('/:id', categoryCtrl.editCategory);
route.delete('/:id', categoryCtrl.deleteCategory);

module.exports = route;
