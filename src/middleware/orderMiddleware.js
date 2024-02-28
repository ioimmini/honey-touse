const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

const checkCompleteOrderFrom = (req, res, next) => {
  const { status, product } = req.body;

  // 배송상태가 비어있거나 공백이면 안 됨
  if (!status || !status.trim()) {
    next(
      new AppError(
        commonErrors.requestValidationError,
        'status는 필수값입니다.',
        400,
      ),
    );
    return;
  }

  // // 구매자ID가 비어있거나 공백이면 안 됨
  // if (!customerId || !customerId.trim()) {
  //   next(
  //     new AppError(
  //       commonErrors.requestValidationError,
  //       'customerId는 필수값입니다.',
  //       400,
  //     ),
  //   );
  //   return;
  // }

  // 상품이 비어있으면 안 됨
  if (!product) {
    next(
      new AppError(
        commonErrors.requestValidationError,
        'product는 필수값입니다.',
        400,
      ),
    );
    return;
  }
  next();
};

module.exports = checkCompleteOrderFrom;
