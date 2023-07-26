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

// 상품 수정
router.patch(
  '/products/:productId',
  authMiddleware,
  productController.updateProduct.bind(productController)
);

// 상품 삭제 확인
router.delete(
  '/products/:productId/delete',
  authMiddleware,
  productController.checkProductQuantity.bind(productController)
);

router.delete(
  '/products/:productId/:confirm',
  authMiddleware,
  productController.confirmProductDelete.bind(productController)
);

module.exports = router;
