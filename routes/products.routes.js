const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products-controller');
const productController = new ProductController();
const adminMiddleware = require('../middlewares/admin-middleware');
const authMiddleware = require('../middlewares/auth-middleware');

// 상품 등록
router.post(
  '/products',
  authMiddleware,
  adminMiddleware,
  productController.createProduct.bind(productController)
);

// 상품 전체 조회
router.get(
  '/products',
  authMiddleware,
  productController.getAllProducts.bind(productController)
);

// 상품 타입별 조회
router.get(
  '/products/:type',
  productController.getTypeProducts.bind(productController)
);

// 상품 수정
router.patch(
  '/products/:productId',
  authMiddleware,
  adminMiddleware,
  productController.updateProduct.bind(productController)
);

// 상품 삭제 확인
router.delete(
  '/products/:productId/delete',
  authMiddleware,
  adminMiddleware,
  productController.checkProductQuantity.bind(productController)
);

// 상품 삭제 승인
router.delete(
  '/products/:productId/:confirm',
  authMiddleware,
  adminMiddleware,
  productController.confirmProductDelete.bind(productController)
);

module.exports = router;
