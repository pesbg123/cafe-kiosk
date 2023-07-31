const ProductOrderRepository = require('../repositories/productOrders-repository');

class ProductOrderService {
  constructor() {
    this.productOrderRepository = new ProductOrderRepository();
  }

  // (admin) 상품 발주
  async createProductOrder(ProductId, quantity) {
    const productId = Number(ProductId);
    const productOrderDetails =
      await this.productOrderRepository.createProductOrder(productId, quantity);
    return productOrderDetails;
  }
}

module.exports = ProductOrderService;
