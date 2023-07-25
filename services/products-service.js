const ProductRepository = require('../repositories/products-repository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(name, price, type) {}
}

module.exports = ProductService;
