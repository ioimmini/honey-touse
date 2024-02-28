const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const jwt = require('jsonwebtoken');
const config = require('../config');

const checkAuthentication = (req, res, next) => {
  try {
    // 헤더에서 토큰 추출
    const token = req.headers.authorization.split(' ')[1];

    // 토큰 문자열이 없거나 null인지 확인
    if (!token || token === '') {
      next(
        new AppError(
          commonErrors.authenticationError,
          '토큰이 비어있습니다.',
          401,
        ),
      );
      return;
    }

    // 해당 token이 정상적인 token인지 확인
    const secretKey = config.jwtSecret || 'secretkey';
    const jwtDecoded = jwt.verify(token, secretKey);

    // 토큰에서 역할 추출
    const { role } = jwtDecoded;

    // request 객체에 사용자 역할 추출
    req.userRole = role;

    // 관리자인지 확인 (이메일, 역할)
    if (req.userRole === 'admin') {
      return next();
    } else {
      return next(
        new AppError(
          commonErrors.authorizationError,
          '접근 권한이 없습니다.',
          403,
        ),
      );
    }
  } catch (error) {
    next(
      new AppError(
        commonErrors.authorizationError,
        '접근 권한이 없습니다.',
        403,
      ),
    );
  }
};

module.exports = checkAuthentication;
