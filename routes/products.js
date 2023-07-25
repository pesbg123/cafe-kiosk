const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products-controller');
const productController = new ProductController();
const authMiddleware = require('../middlewares/auth-middleware');

// 상품 등록
router.post(
  '/products',
  authMiddleware,
  productController.createProduct.bind(productController)
);

// 상품 전체 조회
router.get(
  '/products',
  productController.getAllProducts.bind(productController)
);

// 상품 타입별 조회
router.get(
  '/products/:type',
  productController.getTypeProducts.bind(productController)
);

module.exports = router;
