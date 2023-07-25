const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products-controller');
const productController = new ProductController();
const authMiddleware = require('../middlewares/auth-middleware');

// 회원가입
router.post(
  '/products',
  authMiddleware,
  productController.createProduct.bind(productController)
);

module.exports = router;
