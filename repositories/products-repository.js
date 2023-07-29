const { Products } = require('../models');

class ProductRepository {
  // 상품 저장
  async createProduct(productName, productPrice, type) {
    const product = await Products.create({
      productName,
      productPrice,
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

  // productName 기준 상품 조회
  async existProduct(productName) {
    const product = await Products.findOne({ where: { productName } });
    return product;
  }

  // productId 기준 상품 조회
  async existenceProduct(productId) {
    const product = await Products.findOne({ where: { productId } });
    return product;
  }

  // 상품 수정
  async updateProduct(productId, productName, productPrice) {
    const updateCheck = await Products.update(
      {
        productName,
        productPrice,
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
