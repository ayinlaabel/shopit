import express from 'express';
import { category } from '../../interface';

const categoryCtrl = require('../../controllers/products/category.controller');

const route = express.Router();

/**
 * @Method - GET
 * @Functionality - Get All Categories
 */
route.get('/', categoryCtrl.getAllCategories);

/**
 * @Method - POST
 * @Functionality - Create New Category
 * @Params - name- required, parent - optional
 */
route.post('/', categoryCtrl.createCategory);


route.get('/:id', categoryCtrl.getSingleCategory);
route.put('/:id', categoryCtrl.editCategory);
route.delete('/:id', categoryCtrl.deleteCategory);

module.exports = route;
