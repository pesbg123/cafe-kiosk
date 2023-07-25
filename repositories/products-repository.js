const { Products } = require('../models');

class ProductRepository {
  // 상품 저장
  async createProduct(name, price, type) {
    const product = await Products.create({
      name,
      price,
      type,
    });
    return product;
  }

  // 상품 전체 조회
  async getAllProducts() {
    const products = await Products.findAll({});
    return products;
  }

  // 상품 타입별 조회
  async getTypeProducts(type) {
    const products = await Products.findAll({ where: { type } });
    return products;
  }
}

module.exports = ProductRepository;
