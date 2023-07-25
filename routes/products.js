const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products-controller');
const productController = new ProductController();

// 회원가입
router.post(
  '/products',
  productController.createProduct.bind(productController)
);

module.exports = router;
