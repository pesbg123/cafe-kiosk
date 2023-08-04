const OrderService = require('../services/orders-service');

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  // 상품 주문 API
  async createOrder(req, res, next) {
    try {
      // 기본적으로 userId는 null값을 가집니다.
      let userId = null;
      // 로그인한 유저일경우 userId 할당

      if (res.locals.user) {
        userId = res.locals.user.userId;
      }
      console.log(userId);

      const { productId } = req.params;
      const { quantity, options } = req.body;
      await this.orderService.saveOptionsCache(productId);

      const order = await this.orderService.createOrder(
        userId,
        productId,
        quantity,
        options
      );

      res.json(order);
    } catch (error) {
      console.log(error);

      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }
}

module.exports = OrderController;
