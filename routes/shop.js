const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../utils/path');
const shopController = require(path.join(rootDir, 'controllers', 'shop'));

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails)
router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrder);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-product', shopController.postCartDeleteItem);

module.exports = router;