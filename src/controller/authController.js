const { authService } = require('../service');
const utils = require('../misc/utils');
const jwt = require('jsonwebtoken');
const config = require('../config');

const authController = {
  // 회원가입 컨트롤러
  async postSignUp(req, res, next) {
    try {
      const { name, phoneNumber, email, password, address, addressDetail } =
        req.body;

      const newUser = await authService.signUp({
        name,
        phoneNumber,
        email,
        plainPassword: password,
        address,
        addressDetail,
        role: 'user', // 기본적으로 일반회원은 'user'
      });

      res.status(201).json(utils.buildResponse(newUser));
    } catch (error) {
      next(error);
    }
  },

  // 로그인 컨트롤러
  async postSignIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await authService.signIn({
        email,
        plainPassword: password,
      });

      res.status(201).json(utils.buildResponse(token));
    } catch (error) {
      next(error);
    }
  },

  // 개인정보 수정 컨트롤러
  async patchUpdateProfile(req, res, next) {
    try {
      const { email, address, addressDetail, password } = req.body;

      const data = await authService.updateProfile({
        email,
        address,
        addressDetail,
        password,
      });

      res.status(200).json(utils.buildResponse(data));
    } catch (error) {
      next(error);
    }
  },

  // 모든 회원 정보 조회 컨트롤러
  async getAllProfile(req, res, next) {
    try {
      const data = await authService.getAllProfile();
      res.status(200).json(utils.buildResponse(data));
    } catch (error) {
      next(error);
    }
  },

  // 개인정보 조회 컨트롤러
  async getProfile(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      // 해당 token이 정상적인 token인지 확인
      const secretKey = config.jwtSecret || 'secretkey';
      const jwtDecoded = jwt.verify(token, secretKey);

      // 토큰에서 이메일 추출
      const { email } = jwtDecoded;

      const userProfile = await authService.getProfile(email);

      res.status(200).json(utils.buildResponse(userProfile));
    } catch (error) {
      next(error);
    }
  },

  // 회원탈퇴 컨트롤러
  async postDeleteProfile(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      // 해당 token이 정상적인 token인지 확인
      const secretKey = config.jwtSecret || 'secretkey';
      const jwtDecoded = jwt.verify(token, secretKey);

      // 토큰에서 이메일 추출
      const { email } = jwtDecoded;

      const data = await authService.deleteProfile(email);

      res.status(200).json(utils.buildResponse(data));
    } catch (error) {
      next(error);
    }
  },

  // 이메일 인증 요청 컨트롤러
  async postEmailVerification(req, res, next) {
    try {
      const { email } = req.body;

      const verificationCode = await authService.sendVerificationCode(email);

      res.status(200).json(utils.buildResponse(verificationCode));
    } catch (error) {
      next(error);
    }
  },

  // 이메일 인증 확인 컨트롤러
  async postVerifyEmail(req, res, next) {
    try {
      const { inputNumber, email } = req.body;

      const result = await authService.verifyEmail(inputNumber, email);

      res.status(200).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },

  // 새로운 비밀번호로 변경 확인 컨트롤러
  async postChangePassword(req, res, next) {
    try {
      const { email, newPassword, newPasswordConfirm } = req.body;

      const result = await authService.changePassword(
        email,
        newPassword,
        newPasswordConfirm,
      );

      res.status(201).json(utils.buildResponse(result));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
