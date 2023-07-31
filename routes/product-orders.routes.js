const express = require('express');
const router = express.Router();
const ProductOrderController = require('../controllers/productOrders-controller');
const productOrderController = new ProductOrderController();
const adminMiddleware = require('../middlewares/admin-middleware');
const authMiddleware = require('../middlewares/auth-middleware');

// (admin) 상품 발주
router.post(
  '/products/:productId/productOrders',
  authMiddleware,
  adminMiddleware,
  productOrderController.createProductOrder.bind(productOrderController)
);

module.exports = router;
