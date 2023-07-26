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
          .json({ errorMessage: 'Please enter the name of the product' });
      }
      if (!type) {
        return res
          .status(400)
          .json({ errorMessage: 'Please enter the type of the product' });
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
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 상품 전체 조회
  async getAllProducts(req, res, next) {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 상품 타입별 조회
  async getTypeProducts(req, res, next) {
    try {
      const { type } = req.params;
      const products = await this.productService.getTypeProducts(type);
      res.status(200).json(products);
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 상품 수정
  async updateProduct(req, res, next) {
    try {
      const { userId } = res.locals.user;
      const { productId } = req.params;
      const { name, price } = req.body;
      // 데이터 유효성 검증
      if (!name || !price) {
        return res
          .status(400)
          .json({ errorMessage: 'Please enter the name and price.' });
      }
      if (price < 0) {
        return res
          .status(400)
          .json({ errorMessage: 'Please enter a valid price.' });
      }
      const updateCheck = await this.productService.updateProduct(
        productId,
        name,
        price,
        userId
      );
      res.status(200).json({ message: 'Update successful', updateCheck });
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 상품의 수량이 남아있다면 확인 메세지를 응답하고, 아니면 바로 삭제
  async checkProductQuantity(req, res, next) {
    try {
      const { userId } = res.locals.user;
      const { productId } = req.params;
      const message = await this.productService.checkProductQuantity(
        userId,
        productId
      );
      res.status(200).json({ message: message.message });
    } catch (error) {
      console.log(error);

      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 삭제 확인
  async confirmProductDelete(req, res, next) {
    try {
      const { userId } = res.locals.user;
      const { productId, confirm } = req.params;
      const message = await this.productService.confirmProductDelete(
        userId,
        productId,
        confirm
      );
      res.status(200).json({ message: message.message });
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }
}
module.exports = ProductController;
