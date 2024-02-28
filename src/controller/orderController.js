const { orderService } = require('../service');
const utils = require('../misc/utils');
const jwt = require('jsonwebtoken');
const config = require('../config');

const orderController = {
  async postOrder(req, res, next) {
    try {
      const { status, product, memo, payment } = req.body;
      let customerId;

      // 토큰에서 유저 ID를 확인하여 customerId 할당
      if (req.headers.authorization) {
        // 토큰 추출
        const token = req.headers.authorization.split(' ')[1];
        // 해당 token이 정상적인 token인지 확인
        const secretKey = config.jwtSecret || 'secretkey';
        const jwtDecoded = jwt.verify(token, secretKey);
        const { id } = jwtDecoded;
        customerId = id;
      } else {
        // 비회원의 경우 customerId를 랜덤 생성
        const date = new Date();
        const timestamp = date.getTime(); // 현재 시간을 밀리초로 가져옴
        const random = Math.floor(Math.random() * 10000); // 0부터 9999까지의 랜덤한 숫자 생성
        const customerId = `guest_${timestamp}_${random}`; // 예: guest_1646056800000_1234 고유 Id값
        return customerId;
      }

      const order = await orderService.createOrder({
        status,
        product,
        customerId,
        memo,
        payment,
      });

      res.status(201).json(utils.buildResponse(order));
    } catch (error) {
      next(error);
    }
  },

  async getOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrder(id);
      res.json(utils.buildResponse(order));
    } catch (error) {
      next(error);
    }
  },
  // 특정 구매자 id로 주문 조회
  async getOrders(req, res, next) {
    try {
      // 로그인 미들웨어의 req.userId 불러와서 바로 사용
      const customerId = req.userId;
      const orders = await orderService.getOrdersByCustomerId(customerId);
      res.json(utils.buildResponse(orders));
    } catch (error) {
      next(error);
    }
  },
  // 관리자 모든 주문 조회
  async getAllOrders(req, res, next) {
    try {
      const orders = await orderService.getOrders();
      res.json(utils.buildResponse(orders));
    } catch (error) {
      next(error);
    }
  },

  async getOrdersByStatus(req, res, next) {
    try {
      const { status } = req.query;
      if (status) {
        const orders = await orderService.getOrdersByStatus(status);
        return res.json(utils.buildResponse(orders));
      }
      const orders = await orderService.getOrdersByStatus();
      res.json(utils.buildResponse(orders));
    } catch (error) {
      next(error);
    }
  },

  async putOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { status, customerId, product, memo, payment } = req.body;
      const order = await orderService.updateOrder(id, {
        status,
        customerId,
        product,
        memo,
        payment,
      });
      res.json(utils.buildResponse(order));
    } catch (error) {
      next(error);
    }
  },

  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.deleteOrder(id);
      res.status(204).json(utils.buildResponse(order));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
