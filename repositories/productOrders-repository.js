const { ProductOrders, Products } = require('../models');

class ProductOrderRepository {
  // (admin) 상품 발주
  async createProductOrder(ProductId, quantity) {
    const productOrderDetails = await ProductOrders.create({
      ProductId,
      quantity,
    });
    return productOrderDetails;
  }

  // (admin) 상품 발주 조회
  async existProductOrder(productOrderId) {
    const existProductOrder = await ProductOrders.findOne({
      where: { productOrderId },
    });
    return existProductOrder;
  }

  // (admin) 상품 발주 상태 수정 ORDERED, PENDING
  async updateProductOrder(productOrderId, productOrderState) {
    await ProductOrders.update(
      { productOrderState },
      { where: { productOrderId } }
    );
    const productOrder = await this.existProductOrder(productOrderId);
    return { message: 'Success', productOrder };
  }

  // (admin) 상품 발주 상태 수정 COMPLETED
  async updateProductOrderCompleted(
    productOrderId,
    productOrderState,
    transaction
  ) {
    await ProductOrders.update(
      { productOrderState },
      { where: { productOrderId }, transaction }
    );
    const productOrder = await this.existProductOrder(productOrderId);
    return { message: 'Success', productOrder };
  }

  // (admin) 상품 수량 증가
  async addQuantity(productId, quantity, transaction) {
    await Products.increment('quantity', {
      by: quantity,
      where: { productId },
      transaction,
    });
    return { message: 'Success!' };
  }
  // (admin) 상품 수량 감소
  async subtractionQuantity(productId, quantity, transaction) {
    await Products.decrement('quantity', {
      by: quantity,
      where: { productId },
      transaction,
    });
    return { message: 'Success!' };
  }
}

module.exports = ProductOrderRepository;
