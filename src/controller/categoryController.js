const { categoryService } = require('../service');
const utils = require('../misc/utils');

const categoryController = {
  async postCategory(req, res, next) {
    try {
      const { name } = req.body;
      const category = await categoryService.createCategory({ name });
      res.status(201).json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async getCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategory(id);
      res.json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req, res, next) {
    try {
      const { name } = req.query;
      const categories = await categoryService.getCategories({ name });
      res.json(utils.buildResponse(categories));
    } catch (error) {
      next(error);
    }
  },

  async putCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await categoryService.updateCategory(id, {
        name,
      });
      res.json(utils.buildResponse(category));
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.status(204).send(); // 204 상태 코드 반환
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
