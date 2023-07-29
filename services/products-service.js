const ProductRepository = require('../repositories/products-repository');
const AuthRepository = require('../repositories/auth-repository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.authRepository = new AuthRepository();
  }

  // 상품 저장
  async createProduct(productName, productPrice, type) {
    const typeLower = type.toLowerCase();
    // enum 겁증 array
    const types = ['coffee', 'juice', 'food'];
    if (!types.includes(typeLower)) {
      throw new Error('Please provide a valid type.');
    }
    // 이미 존재하는 상품인지 검증
    const existProduct = await this.productRepository.existProduct(productName);
    if (existProduct) {
      throw new Error(`${existProduct.dataValues.productName} already exists`);
    }
    // createProduct() 메서드 호출 후 리턴값 할당
    const product = await this.productRepository.createProduct(
      productName,
      productPrice,
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
  async updateProduct(productId, productName, productPrice) {
    const updateCheck = await this.productRepository.updateProduct(
      productId,
      productName,
      productPrice
    );
    return updateCheck;
  }

  // 정말 삭제할건지 물어보는 api
  async checkProductQuantity(productId) {
    const checkProductQuantity = await this.productRepository.existenceProduct(
      productId
    );

    if (checkProductQuantity === null) {
      // 상품이 존재하지 않는다면
      throw new Error('The product does not exist.');
    }

    if (!checkProductQuantity.quantity) {
      // 남아있는 수량이 없을시 즉시 삭제
      return await this.deleteProduct(productId);
    }

    if (checkProductQuantity) {
      // 정말 삭제하는지 확인 메시지 응답
      return {
        message: `Are you sure you want to delete? There are ${checkProductQuantity.quantity} items left in stock.`,
      };
    }
  }

  // 삭제 확인 받기
  async confirmProductDelete(productId, confirm) {
    if (confirm.toLowerCase() === 'yes') {
      // 상품이 존재하지 않을경우
      await this.checkProductQuantity(productId);
      return await this.deleteProduct(productId);
    }
    return { message: 'Product deletion is canceled.' };
  }

  // 상품 즉시 삭제
  async deleteProduct(productId) {
    // 삭제
    const message = await this.productRepository.deleteProduct(productId);
    return message;
  }
}

module.exports = ProductService;
