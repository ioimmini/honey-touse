const express = require('express');
const {
  categoryController,
  orderController,
  productController,
  authController,
} = require('../controller');
const { checkProductCategoryFrom } = require('../middleware');
const { adminMiddleware, orderMiddleware } = require('../middleware');
const adminRouter = express.Router();

// GET /api/v1/admin/orders
// 주문 조회
adminRouter.get('/orders', adminMiddleware, orderController.getAllOrders);

// GET /api/v1/admin/orders/status?status=
// 관리자 주문상태별 조회
adminRouter.get(
  '/orders/status',
  adminMiddleware,
  orderController.getOrdersByStatus,
);

// POST /api/v1/admin/orders/
// 관리자 주문 추가
adminRouter.post(
  '/orders',
  adminMiddleware,
  orderMiddleware,
  orderController.postOrder,
);

// PUT /api/v1/admin/orders/:id
// 관리자 주문 수정 (단일 상품)
adminRouter.put(
  '/orders/:id',
  adminMiddleware,
  // orderMiddleware,
  orderController.putOrder,
);
// DELETE /api/v1/admin/orders/:id
// 관리자 주문 삭제 (단일 상품)
adminRouter.delete('/orders/:id', adminMiddleware, orderController.deleteOrder);

// PUT /api/v1/admin/categories
// 관리자 카테고리 추가
adminRouter.post(
  '/categories',
  adminMiddleware,
  categoryController.postCategory,
);
// PUT /api/v1/admin/categories/:id
// 관리자 카테고리 수정
adminRouter.put(
  '/categories/:id',
  adminMiddleware,
  categoryController.putCategory,
);
// DELETE /api/v1/admin/categories/:id
// 관리자 카테고리 삭제
adminRouter.delete(
  '/categories/:id',
  adminMiddleware,
  categoryController.deleteCategory,
);

// POST /api/v1/admin/products
// 관리자 상품 추가
adminRouter.post(
  '/products',
  adminMiddleware,
  checkProductCategoryFrom,
  productController.postProduct,
);
// PUT /api/v1/admin/products/:id
// 관리자 상품 수정 (단일 상품)
adminRouter.put(
  '/products/:id',
  adminMiddleware,
  // checkProductCategoryFrom,
  productController.putProduct,
);
// DELETE /api/v1/admin/products/:id
// 관리자 상품 삭제 (단일 상품)
adminRouter.delete(
  '/products/:id',
  adminMiddleware,
  productController.deleteProduct,
);

// GET /api/v1/admin/userInfo/
// 관리자 전체 회원 조회
adminRouter.get('/userInfo', adminMiddleware, authController.getAllProfile);

module.exports = adminRouter;
