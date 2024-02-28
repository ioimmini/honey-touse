const express = require('express');
const { orderController } = require('../controller');
const { orderMiddleware } = require('../middleware');
const loginCheck = require('../middleware/loginMiddleware');
const orderRouter = express.Router();

// POST /api/v1/orders
// 주문 추가
orderRouter.post('/', orderMiddleware, orderController.postOrder);

// GET /api/v1/orders/:id
// 주문 조회 (단일 상품)
orderRouter.get('/:id', orderController.getOrder);

// GET /api/v1/orders
// 구매자별 주문 조회
orderRouter.get('/', loginCheck, orderController.getOrders);

// PUT /api/v1/orders/:id
// 주문 수정 (단일 상품)
orderRouter.put('/:id', orderMiddleware, orderController.putOrder);

// DELETE /api/v1/orders/:id
// 주문 삭제 (단일 상품)
orderRouter.delete('/:id', orderMiddleware, orderController.deleteOrder);

module.exports = orderRouter;
