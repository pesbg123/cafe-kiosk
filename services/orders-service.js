const NodeCache = require('node-cache');
const cache = new NodeCache();

const OrderRepository = require('../repositories/orders-repository');
const ProductRepository = require('../repositories/products-repository');
const AuthRepository = require('../repositories/auth-repository');

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.authRepository = new AuthRepository();
  }

  // 옵션 정보 캐싱
  async saveOptionsCache(ProductId) {
    const options = await this.orderRepository.getOptions(ProductId);
    // options 란 key로 options변수를 캐시에 저장
    cache.set('options', options);
  }

  // 상품 주문 API
  async createOrder(userId, productId, quantity, options) {
    // 주문 정보 저장
    const order = await this.orderRepository.createOrder(userId);
    const orderId = order.dataValues.orderId;

    let price = 0;
    // 캐싱된 옵션 정보 할당
    const optionsValues = cache.get('options');
    if (!optionsValues) {
      throw new Error('The option information is invalid.');
    }
    // 해당 상품 가격 가져오기
    const product = await this.productRepository.existenceProduct(productId);

    const productPrice = product.dataValues.productPrice;
    price = productPrice * quantity;

    if (options.extra_price) {
      price += optionsValues.dataValues.extra_price * quantity;
    }
    if (options.shot_price) {
      price += optionsValues.dataValues.shot_price * quantity;
    }

    // 주문 상세 저장
    const orderItem = await this.orderRepository.createOrderItem(
      productId,
      orderId,
      quantity,
      price,
      options
    );
    const res = { order, orderItem };
    return res;
  }
}

module.exports = OrderService;
