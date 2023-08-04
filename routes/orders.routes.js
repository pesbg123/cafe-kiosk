const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders-controller');
const ordersController = new OrdersController();
const authMiddleware = require('../middlewares/auth-middleware');

// (user) 상품 주문
router.post(
  '/products/:productId/orders',
  authMiddleware,
  ordersController.createOrder.bind(ordersController)
);

module.exports = router;
