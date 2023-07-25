const ProductRepository = require('../repositories/products-repository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }
}

module.exports = ProductService;
