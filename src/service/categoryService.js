const { categoryDAO } = require('../data-access');
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

class CategoryService {
  // 카테고리 생성 메소드
  async createCategory({ name }) {
    // 아래 계층에 있는 DAO를 호출!
    const newCategory = await categoryDAO.create({
      name,
    });
    return newCategory;
  }
  // 특정 id를 갖는 하나의 카테고리를 가져오는 메소드
  async getCategory(id) {
    // 아래 계층에 있는 DAO를 호출!
    const category = await categoryDAO.findById(id);
    return category;
  }
  async getCategories() {
    // 아래 계층에 있는 DAO를 호출!
    const categories = await categoryDAO.findMany();
    return categories;
  }
  // 특정 id를 갖는 하나의 카테고리를 업데이트하는 메소드
  async updateCategory(id, { name }) {
    // 아래 계층에 있는 DAO를 호출!
    const updatedCategory = await categoryDAO.updateById(id, { name });
    if (updatedCategory === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        '해당 카테고리가 존재하지 않습니다',
        404,
      );
    }
    return updatedCategory;
  }
  // 특정 id를 갖는 하나의 카테고리를 삭제하는 메소드
  async deleteCategory(id) {
    // 아래 계층에 있는 DAO를 호출!
    const deletedCategory = await categoryDAO.deleteById(id);
    if (deletedCategory === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        '해당 카테고리가 존재하지 않습니다',
        404,
      );
    }
    return deletedCategory;
  }
}

module.exports = new CategoryService();
