const express = require('express');
const { productController } = require('../controller');
const { checkProductCategoryFrom } = require('../middleware/productMiddleware');

const productRouter = express.Router();

// POST /api/v1/products
// 상품 추가
productRouter.post(
  '/',
  checkProductCategoryFrom,
  productController.postProduct,
);

// GET rs/api/v1/products/:id
// 상품 조회 (단일 상품)
productRouter.get('/:id', productController.getProduct);

// GET /api/v1/products?categoryId=
// 상품 조회 (전체 상품)
productRouter.get('/', productController.getProducts);

// GET /api/v1/products/:id/options/:id
// 상품 옵션 조회 (단일 상품)
productRouter.get('/:id/options/:id', productController.getProductOption);

module.exports = productRouter;
