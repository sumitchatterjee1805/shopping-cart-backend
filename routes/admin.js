const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/product', adminController.postAddProduct);
router.post('/category', adminController.postAddCategory);

router.get('/category/:categoryId/product', adminController.getProductsByCategory);
router.get('/category', adminController.getCategories);

router.patch('/product', adminController.editProduct);

module.exports = router;