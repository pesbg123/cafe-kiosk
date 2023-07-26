const { Products } = require('../models');
const products = require('../models/products');

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
    const products = await Products.findAll({ order: [['createdAt', 'DESC']] });
    return products;
  }

  // 상품 타입별 조회
  async getTypeProducts(type) {
    const products = await Products.findAll({
      where: { type },
      order: [['createdAt', 'DESC']],
    });
    return products;
  }

  // 상품 개수 조회
  async existenceProduct(productId) {
    const product = await Products.findOne({ where: { productId } });
    return product;
  }

  // 상품 수정
  async updateProduct(productId, name, price) {
    const updateCheck = await Products.update(
      {
        name,
        price,
      },
      { where: { productId } }
    );
    return updateCheck;
  }

  // 상품 삭제
  async deleteProduct(productId) {
    await Products.destroy({ where: { productId } });
    return { message: 'Deletion completed!' };
  }
}

module.exports = ProductRepository;
