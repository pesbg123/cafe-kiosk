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
}

module.exports = ProductRepository;
