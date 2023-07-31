const ProductService = require('../services/products-service');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // 상품 추가
  async createProduct(req, res, next) {
    try {
      const { productName, productPrice, type } = req.body;
      // productName이 비어있는지 확인
      if (!productName) {
        return res.status(400).json({
          errorMessage: 'Please enter the productName of the product',
        });
      }
      if (!type) {
        // type이 비어있는지 확인
        return res
          .status(400)
          .json({ errorMessage: 'Please enter the type of the product' });
      }
      if (productPrice < 0) {
        // 가격이 음수인지 확인
        return res
          .status(400)
          .json({ errorMessage: 'Please enter a valid productPrice.' });
      }
      // createProduct() 메서드 호출 후 리턴값 할당
      const product = await this.productService.createProduct(
        productName,
        productPrice,
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
      const { productId } = req.params;
      const { productName, productPrice } = req.body;
      // 기존에 이미 상품을 등록했기에, 가격만 검증
      if (productPrice < 0) {
        return res
          .status(400)
          .json({ errorMessage: 'Please enter a valid productPrice.' });
      }
      const updateCheck = await this.productService.updateProduct(
        productId,
        productName,
        productPrice
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
      const { productId } = req.params;
      const message = await this.productService.checkProductQuantity(productId);
      res.status(200).json({ message: message.message });
    } catch (error) {
      const errorResponse = {
        errorMessage: error.message,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // 삭제 확인
  async confirmProductDelete(req, res, next) {
    try {
      const { productId, confirm } = req.params;
      const message = await this.productService.confirmProductDelete(
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
