const { ProductOrders } = require('../models');

class ProductOrderRepository {
  async createProductOrder(ProductId, quantity) {
    const productOrderDetails = await ProductOrders.create({
      ProductId,
      quantity,
    });
    return productOrderDetails;
  }
}

module.exports = ProductOrderRepository;
