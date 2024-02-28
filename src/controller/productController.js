const { productService } = require('../service');
const utils = require('../misc/utils');

const productController = {
  async postProduct(req, res, next) {
    try {
      const { name, categoryId, brand, price, image, options, description } =
        req.body;
      const product = await productService.createProduct({
        name,
        categoryId,
        brand,
        price,
        image,
        options,
        description,
      });
      res.status(201).json(utils.buildResponse(product));
    } catch (error) {
      next(error);
    }
  },
  async getProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.json(utils.buildResponse(product));
    } catch (error) {
      next(error);
    }
  },

  async getProducts(req, res, next) {
    try {
      const { categoryId } = req.query;

      if (categoryId) {
        const products =
          await productService.getProductsByCategoryId(categoryId);
        return res.json(utils.buildResponse(products));
      }
      const products = await productService.getProducts();
      res.json(utils.buildResponse(products));
    } catch (error) {
      next(error);
    }
  },
  async putProduct(req, res, next) {
    try {
      const { id } = req.params;

      const { name, categoryId, brand, price, image, options, description } =
        req.body;
      const product = await productService.updateProduct(id, {
        name,
        categoryId,
        brand,
        price,
        image,
        options,
        description,
      });
      res.json(utils.buildResponse(product));
    } catch (error) {
      next(error);
    }
  },
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(204).send(); // 204 상태 코드 반환
    } catch (error) {
      next(error);
    }
  },
  async postProductOption(req, res, next) {
    try {
      const { id } = req.params;
      const { name, value } = req.body;
      const option = await productService.updateProduct(id, {
        name,
        value,
      });
      res.json(utils.buildResponse(option));
    } catch (error) {
      next(error);
    }
  },
  async getProductOption(req, res, next) {
    try {
      const { id } = req.params;
      const option = await productService.getOptionById(id);
      res.json(utils.buildResponse(option));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
