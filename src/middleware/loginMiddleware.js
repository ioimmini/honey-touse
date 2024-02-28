const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const jwt = require('jsonwebtoken');
const config = require('../config');

/*
req.headers.authorization: "Bearer eyJhb(문자열)"
1. 토큰이 비어있는지 확인
2. 토큰의 진위여부 확인
*/

const loginCheck = (req, res, next) => {
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

    // 토큰 에러 종류별로 처리
    jwt.verify(token, secretKey, function (err, jwtDecoded) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          next(
            new AppError(
              commonErrors.authorizationError,
              '토큰이 만료되었습니다.',
              401,
            ),
          );
        } else if (err.name === 'JsonWebTokenError') {
          next(
            new AppError(
              commonErrors.authorizationError,
              '유효하지 않은 토큰입니다.',
              401,
            ),
          );
        } else if (err.name === 'NotBeforeError') {
          next(
            new AppError(
              commonErrors.authorizationError,
              '토큰이 아직 활성화되지 않았습니다.',
              401,
            ),
          );
        } else {
          next(
            new AppError(
              commonErrors.authorizationError,
              '토큰 검증 중 오류가 발생했습니다.',
              401,
            ),
          );
        }
        return;
      }

      // 토큰에서 이메일, 역할 추출
      const { id, email, role } = jwtDecoded;

      // request 객체에 사용자 id, 이메일, 역할 추출
      req.userId = id;
      req.userEmail = email;
      req.userRole = role;

      next();
    });
  } catch (error) {
    console.log('error: ', error);
    next(
      new AppError(
        commonErrors.authorizationError,
        '접근 권한이 없습니다.',
        403,
      ),
    );
  }
};

module.exports = loginCheck;
