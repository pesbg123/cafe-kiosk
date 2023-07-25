const ProductService = require('../services/products-service');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // 상품 추가
  async createProduct(req, res, next) {
    try {
      const { name, price, type } = req.body;
      // name이 비어있는지 확인
      if (!name) {
        return res
          .status(400)
          .josn({ errorMessage: 'Please enter the name of the product' });
      }
      // createProduct() 메서드 호출 후 리턴값 할당
      const product = await this.productService.createProduct(
        name,
        price,
        type
      );
      res.status(200).json({ message: 'Success', product });
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.}
    }
  }
}
module.exports = ProductController;
