const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

const checkProductIdFrom = (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    next(
      new AppError(
        commonErrors.requestValidationError,
        `id는 필수값입니다.`,
        400,
      ),
    );
    return;
  }
  next();
};

const checkProductCategoryFrom = (req, res, next) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    next(
      new AppError(
        commonErrors.requestValidationError,
        `category는 필수값입니다.`,
        400,
      ),
    );
    return;
  }
  next();
};

const checkOptionIdFrom = (req, res, next) => {
  const { optionId } = req.body;
  if (!optionId) {
    next(
      new AppError(
        commonErrors.requestValidationError,
        `id는 필수값입니다.`,
        400,
      ),
    );
    return;
  }
  next();
};

module.exports = {
  checkProductIdFrom,
  checkProductCategoryFrom,
  checkOptionIdFrom,
};
