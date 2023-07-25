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

  // 상품 전체 조회
  async getAllProducts() {
    const products = await this.productRepository.getAllProducts();
    if (!products || products.length === 0) {
      throw new Error('Product does not exist.');
    }
    return products;
  }

  // 상품 타입별 조회
  async getTypeProducts(type) {
    const products = await this.productRepository.getTypeProducts(type);
    if (!products || products.length === 0) {
      throw new Error('Product does not exist.');
    }
    return products;
  }
}

module.exports = ProductService;
