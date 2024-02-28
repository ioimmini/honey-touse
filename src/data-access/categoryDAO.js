const { Category } = require('./model');

class CategoryDAO {
  async create({ name }) {
    const category = new Category({ name });
    await category.save();
    return category.toObject();
  }
  async findMany() {
    const categories = await Category.find().lean();
    return categories;
  }

  async findById(id) {
    const category = await Category.findById(id).lean();
    return category;
  }

  async updateById(id, { name }) {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { runValidators: true, new: true },
    ).lean();
    return updatedCategory;
  }

  async deleteById(id) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    return deletedCategory;
  }
}

module.exports = new CategoryDAO();
