const ProductRepository = require('../repositories/products-repository');
const AuthRepository = require('../repositories/auth-repository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.authRepository = new AuthRepository();
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

  // 상품 수정
  async updateProduct(productId, name, price, userId) {
    // admin인지 확인
    const adminCheck = await this.authRepository.adminCheck(userId);

    if (!adminCheck) {
      throw new Error('You are not an admin');
    }
    const updateCheck = await this.productRepository.updateProduct(
      productId,
      name,
      price
    );
    return updateCheck;
  }

  // 정말 삭제할건지 물어보는 api
  async checkProductQuantity(userId, productId) {
    const checkProductQuantity = await this.productRepository.existenceProduct(
      productId
    );

    if (checkProductQuantity === null) {
      // 상품이 존재하지 않는다면
      throw new Error('The product does not exist.');
    }

    if (!checkProductQuantity.quantity) {
      // 남아있는 수량이 없을시 즉시 삭제
      return await this.deleteProduct(userId, productId);
    }

    if (checkProductQuantity) {
      // 정말 삭제하는지 확인 메시지 응답
      return {
        message: `Are you sure you want to delete? There are ${checkProductQuantity.quantity} items left in stock.`,
      };
    }
  }

  // 삭제 확인 받기
  async confirmProductDelete(userId, productId, confirm) {
    if (confirm.toLowerCase() === 'yes') {
      return await this.deleteProduct(userId, productId);
    }
    return { message: 'Product deletion is canceled.' };
  }

  // 상품 즉시 삭제
  async deleteProduct(userId, productId) {
    // admin인지 확인
    const adminCheck = await this.authRepository.adminCheck(userId);
    if (!adminCheck) {
      throw new Error('You are not an admin');
    }
    // 삭제
    const message = await this.productRepository.deleteProduct(productId);
    return message;
  }
}

module.exports = ProductService;
