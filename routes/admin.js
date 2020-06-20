const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/product', adminController.postAddProduct);
router.post('/category', adminController.postAddCategory);

module.exports = router;