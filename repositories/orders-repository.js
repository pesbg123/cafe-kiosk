const { Orders, OrderItems, Options } = require('../models');

class OrderRepository {
  // 옵션 조회
  async getOptions(ProductId) {
    const options = await Options.findOne({ where: { ProductId } });
    return options;
  }

  // order 정보 저장
  async createOrder(UserId) {
    const order = await Orders.create({ UserId });
    return order;
  }

  // orderItem 정보 저장
  async createOrderItem(ProductId, OrderId, quantity, price, options) {
    const orderItem = await OrderItems.create({
      ProductId,
      OrderId,
      quantity,
      price,
      options,
    });
    return orderItem;
  }
}
module.exports = OrderRepository;
