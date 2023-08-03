const { DataTypes } = require('sequelize');
const ProductOrderService = require('../services/productOrders-service');
const e = require('express');

class ProductOrderController {
  constructor() {
    this.productOrderService = new ProductOrderService();
  }

  // (admin) 상품 발주
  async createProductOrder(req, res, next) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      // quantity 데이터 유효성 검증
      if (!quantity || typeof quantity !== 'number') {
        res
          .status(400)
          .json({ errorMessage: 'Please enter the correct quantity' });
      }
      const productOrderDetails =
        await this.productOrderService.createProductOrder(productId, quantity);
      res.status(200).json(productOrderDetails);
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // (admin) 발주 상태 수정
  async updateProductOrder(req, res, next) {
    try {
      const { productOrderId } = req.params;
      const { state } = req.body;
      // state 데이터 유효성 검증
      if (typeof state !== 'number') {
        res
          .status(400)
          .json({ errorMessage: 'Please enter an INTEGER data type.' });
      }
      const productOrder = await this.productOrderService.updateProductOrder(
        Number(productOrderId),
        state
      );
      res.status(200).json(productOrder);
    } catch (error) {
      console.log(error.message);

      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }
}

module.exports = ProductOrderController;
