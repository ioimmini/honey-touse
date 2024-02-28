const { Product } = require('./model');

class ProductDAO {
  async create({
    name,
    id,
    categoryId,
    brand,
    price,
    image,
    options,
    description,
  }) {
    const product = new Product({
      name,
      id,
      categoryId,
      brand,
      price,
      image,
      options,
      description,
    });
    await product.save();

    return product.toObject();
  }

  async updateById(
    id,
    { name, categoryId, brand, price, image, options, description },
  ) {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, categoryId, brand, price, image, options, description },
      { runValidators: true, new: true },
    ).lean();
    return updatedProduct;
  }

  async deleteById(id) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  }
  async findMany() {
    const products = await Product.find().populate('options').lean();
    return products;
  }
  async findByCategoryId(categoryId) {
    const products = await Product.find({ categoryId })
      .populate('options')
      .lean();
    return products;
  }
  async findById(id) {
    const product = await Product.findById(id).populate('options').lean();
    return product;
  }
}

module.exports = new ProductDAO();
