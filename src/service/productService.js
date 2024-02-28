const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const { productDAO, optionDAO } = require('../data-access');

/**
 * HTTP request Body
 */
class ProductService {
  async createProduct({
    name,
    categoryId,
    brand,
    price,
    image,
    options,
    description,
  }) {
    const newOptions = await optionDAO.create({
      name: options.name,
      value: options.value,
    });

    // 아래 계층에 있는 DAO를 호출!
    const newProduct = await productDAO.create({
      name,
      categoryId,
      brand,
      price,
      image,
      options: newOptions._id,
      description,
    });

    return newProduct;
  }

  async deleteProduct(id) {
    const product = await productDAO.findById(id);
    await optionDAO.deleteById(product.options);
    const deletedProduct = await productDAO.deleteById(id);
    return deletedProduct;
  }

  async getProducts() {
    const products = await productDAO.findMany();
    return products;
  }

  async getProductsByCategoryId(categoryId) {
    const products = await productDAO.findByCategoryId(categoryId);
    return products;
  }
  async getOptions() {
    const options = await optionDAO.findMany();
    return options;
  }

  async getOptionById(id) {
    const option = await optionDAO.findById(id);
    return option;
  }
  async getProductById(id) {
    const product = await productDAO.findById(id);
    return product;
  }

  async updateProduct(
    id,
    { name, categoryId, brand, price, image, options, description },
  ) {
    const product = await productDAO.findById(id);

    if (product === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        '해당 상품이 존재하지 않습니다.',
        404,
      );
    }

    const updatedOption = await optionDAO.updateById(product.options, {
      name: options.name,
      values: options.values,
    }); // product.options는 options collection의 ID임

    if (updatedOption === null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        '해당 상품 또는 옵션이 존재하지 않습니다.',
        404,
      );
    }

    const updatedProduct = await productDAO.updateById(id, {
      name,
      categoryId,
      brand,
      price,
      image,
      description,
    });

    return updatedProduct;
  }
}

module.exports = new ProductService();
