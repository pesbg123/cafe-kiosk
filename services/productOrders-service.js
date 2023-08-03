const { sequelize } = require('../models');
const ProductRepository = require('../repositories/products-repository');
const ProductOrderRepository = require('../repositories/productOrders-repository');

class ProductOrderService {
  constructor() {
    this.productOrderRepository = new ProductOrderRepository();
    this.productReposiotory = new ProductRepository();
  }

  // (admin) 상품 발주
  async createProductOrder(ProductId, quantity) {
    const productId = Number(ProductId);
    const productOrderDetails =
      await this.productOrderRepository.createProductOrder(productId, quantity);
    return productOrderDetails;
  }

  // (admin) 상품 발주 상태 수정
  async updateProductOrder(productOrderId, productOrderState) {
    const orderState = {
      0: 'ORDERED',
      1: 'PENDING',
      2: 'COMPLETED',
      3: 'CANCELED',
    };
    // 해당 발주가 존재하는지 확인
    const productOrder = await this.productOrderRepository.existProductOrder(
      productOrderId
    );
    // 발주 내역이 존재하지 않을 경우
    if (!productOrder) {
      throw new Error('The corresponding order does not exist.');
    }
    const productId = productOrder.dataValues.ProductId;
    const thisProduct = await this.productReposiotory.existenceProduct(
      productId
    );

    // 발주의 현재 상태
    const currentState = productOrder.dataValues.productOrderState;
    // state 값이 유효한지 확인
    if (typeof orderState[productOrderState] === 'undefined') {
      throw new Error('Invalid state value.');
    }
    // 현재 상태와 새로운 상태가 동일한지 확인
    if (currentState === orderState[productOrderState]) {
      throw new Error('The order is already in the requested state.');
    }
    // ORDERED -> PENDING
    if (
      orderState[currentState] === 'ORDERED' &&
      orderState[productOrderState] === 'PENDING'
    ) {
      console.log('ORDERED -> PENDING');

      // PENDING으로 변경
      return await this.productOrderRepository.updateProductOrder(
        productOrderId,
        productOrderState
      );
    }

    // ORDERED && PENDING -> CANCELED
    if (
      (orderState[currentState] === 'ORDERED' ||
        orderState[currentState] === 'PENDING') &&
      orderState[productOrderState] === 'CANCELED'
    ) {
      console.log('ORDERED && PENDING -> CANCELED');
      return await this.productOrderRepository.updateProductOrder(
        productOrderId,
        productOrderState
      );
    }
    if (orderState[productOrderState] === 'COMPLETED') {
      console.log('수량 증가');

      // 트랜잭션
      const transaction = await sequelize.transaction();
      try {
        // PENDING -> COMPLETED
        await this.productOrderRepository.updateProductOrder(
          productOrderId,
          productOrderState,
          transaction
        );

        // 상품 수량 증가
        const orderQuantity = productOrder.dataValues.quantity;

        const message = await this.productOrderRepository.addQuantity(
          productId,
          orderQuantity,
          transaction
        );

        await transaction.commit();
        return message;
      } catch (error) {
        await transaction.rollback();
        throw new Error(error);
      }
    }
    if (
      (orderState[currentState] === 'COMPLETED' &&
        orderState[productOrderState] === 'CANCELED') ||
      orderState[productOrderState] === 'PENDING' ||
      orderState[productOrderState] === 'ORDERED'
    ) {
      console.log('수량 감소');
      // 현재 상품 수량
      const productQuantity = thisProduct.dataValues.quantity;
      // 발주한 상품 수량
      const orderQuantity = productOrder.dataValues.quantity;
      console.log(orderQuantity > productQuantity);

      if (orderQuantity > productQuantity) {
        throw new Error(
          'The current quantity is smaller than the order quantity, so we cannot cancel the order.'
        );
      }
      const transaction = await sequelize.transaction();
      // 발주 상태 변경
      try {
        // COMPLETED -> CANCELED || PENDING || ORDERED
        await this.productOrderRepository.updateProductOrder(
          productOrderId,
          productOrderState
        );

        // 상품 수량 감소
        const message = await this.productOrderRepository.subtractionQuantity(
          productId,
          orderQuantity,
          transaction
        );

        await transaction.commit();
        return message;
      } catch (error) {
        await transaction.rollback();
        throw new Error(error);
      }
    }
  }
}

module.exports = ProductOrderService;
