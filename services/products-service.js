const ProductRepository = require('../repositories/products-repository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  // 상품 저장
  async createProduct(name, price, type) {
    const typeLower = type.toLowerCase();
    // enum 겁증 array
    const types = ['coffee', 'juice', 'food'];
    // 검증
    if (!types.includes(typeLower)) {
      throw new Error('Please provide a valid type.');
    }
    // createProduct() 메서드 호출 후 리턴값 할당
    const product = await this.productRepository.createProduct(
      name,
      price,
      typeLower
    );
    return product;
  }
}

module.exports = ProductService;
