const express = require('express');
const { authController } = require('../controller');
const loginCheck = require('../middleware/loginMiddleware');

const authRouter = express.Router();

// POST /api/v1/auth/sign-up
// 회원가입
authRouter.post('/sign-up', authController.postSignUp);

// POST /api/v1/auth/sign-in
// 로그인
authRouter.post('/sign-in', authController.postSignIn);

// PATCH /api/v1/auth/me
// 개인정보 수정 (주소, 비밀번호만 수정 가능)
authRouter.patch('/me', loginCheck, authController.patchUpdateProfile);

// GET /api/v1/auth/me
// 개인정보 조회
authRouter.get('/me', loginCheck, authController.getProfile);

// POST /api/v1/auth/withdraw
// 개인정보 삭제 (탈퇴)
authRouter.post('/withdraw', loginCheck, authController.postDeleteProfile);

// POST /api/v1/auth/send-confirmation-email
// 이메일 인증요청
authRouter.post(
  '/send-confirmation-email',
  authController.postEmailVerification,
);

// POST /api/v1/auth/confirm-email
// 이메일 인증완료
authRouter.post('/confirm-email', authController.postVerifyEmail);

// POST /api/v1/auth/change-password
// 비밀번호 변경
authRouter.post(
  '/change-password',
  loginCheck,
  authController.postChangePassword,
);

module.exports = authRouter;
