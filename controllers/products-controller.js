const ProductService = require('../services/products-service');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }
}
module.exports = ProductController;
