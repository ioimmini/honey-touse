const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

const checkIdAndName = (req, res, next) => {
  const { name } = req.body;

  // 카테고리 이름이 빈값이면 안 됨.
  if (!name || !name.trim() || !/^[a-zA-Z\u3131-\uD79D]{1,}$/u.test(name)) {
    next(
      new AppError(
        commonErrors.requestValidationError,
        `카테고리 이름은 한글 또는 영어가 1글자 이상 들어가야 합니다.`,
        400,
      ),
    );
    return;
  }
  next();
};

module.exports = checkIdAndName;
