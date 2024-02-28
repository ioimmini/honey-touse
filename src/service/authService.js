const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { EmailVerification } = require('../data-access/model');
const { userDAO } = require('../data-access');
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const nodemailer = require('nodemailer');
const config = require('../config');

class AuthService {
  // 회원가입 메소드
  async signUp({
    name,
    phoneNumber,
    email,
    plainPassword,
    address,
    addressDetail,
  }) {
    // 회원가입 폼 : 이름, 이메일, 전화번호, 비밀번호 유효성 검사
    // 이름
    if (!isValidName(name)) {
      throw new AppError(
        commonErrors.inputError,
        '이름 형식이 일치하지 않습니다.',
        400,
      );
    }

    // 연락처
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new AppError(
        commonErrors.inputError,
        '전화번호 형식이 일치하지 않습니다.',
        400,
      );
    }

    // 이메일
    if (!isValidEmail(email)) {
      throw new AppError(
        commonErrors.inputError,
        '이메일 형식이 일치하지 않습니다.',
        400,
      );
    }

    // 비밀번호
    if (!isValidPassword(plainPassword)) {
      throw new AppError(
        commonErrors.inputError,
        '비밀번호 형식(8~16자의 영문, 숫자, 특수문자)이 일치하지 않습니다.',
        400,
      );
    }

    // 이메일 존재 여부 확인하는 메소드
    const existingUser = await userDAO.findByEmail(email);
    if (existingUser && existingUser.email !== null) {
      throw new AppError(
        commonErrors.inputError,
        '이미 존재하는 이메일입니다.',
        400,
      );
    }

    // 회원가입 폼 유효성 검사 통과 & 이메일 중복이 아닌 경우
    // ---> 회원가입을 진행

    // 비밀번호를 해싱하여 해시화된 비밀번호 생성
    const hashedPassword = await bcrypt.hash(plainPassword, 15);

    // 회원이 입력한 비밀번호를 해시화된 비밀번호로 변경함.
    // 변경한 내용으로 다시 회원을 생성함.
    const newUser = await userDAO.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      address,
      addressDetail,
      role: 'user', // 기본적으로 일반회원은 'user'이고, 관리자 계정은 DB에서 생성
    });

    return newUser;
  }

  // 로그인 메소드
  async signIn({ email, plainPassword }) {
    try {
      // 유저 정보 email로 불러오기
      const user = await userDAO.findByEmail(email);

      // 해당 유저 정보를 찾을 수 없는 경우
      if (user === null) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '해당 이메일로 가입한 회원이 없습니다.',
          400,
        );
      }

      // 패스워드가 일치하지 않는 경우
      // plainPassword : 사용자가 입력한 비밀번호, user.password : DB에 저장된 해싱된 비밀번호
      const isPasswordValid = await bcrypt.compare(
        plainPassword,
        user.password,
      );

      console.log(
        '사용자가 입력한 번호와 DB에 저장된 번호의 일치 여부',
        isPasswordValid,
      );
      if (!isPasswordValid) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '비밀번호가 일치하지 않습니다.',
          400,
        );
      }

      // MongoDB에서 자동 생성되는 id를 자바스크립트로 변환
      const id = user._id.toString();

      // 로그인 성공 후 jwt 토큰 생성
      const tokenPayload = {
        id,
        email,
        role: user.role,
      };

      // Access Token 발급하기
      const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
        expiresIn: '6h',
      });

      return { token: accessToken };
    } catch (error) {
      console.error('로그인 에러:', error.message);
      throw new AppError(
        commonErrors.authenticationError,
        '인증이 실패하거나 토큰을 생성할 수 없습니다.',
        401,
      );
    }
  }

  // 개인정보 수정 메소드
  async updateProfile({ email, address, addressDetail, newPassword }) {
    try {
      const user = await userDAO.findByEmail(email);

      if (!user) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '해당 이메일로 가입한 회원이 없습니다.',
          400,
        );
      }

      // 이메일 변경시 에러 뜨게 함 (이메일 변경 불가능)
      if (email !== user.email) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '이메일은 수정할 수 없습니다.',
          400,
        );
      }

      const updatedUser = {
        name: user.name,
        phoneNumber: user.phoneNumber,
        email,
        address,
        addressDetail,
        password: newPassword,
        role: 'user',
      };

      // 새로운 비밀번호를 등록한 경우에만 비밀번호 업데이트
      if (newPassword) {
        if (!isValidPassword(newPassword)) {
          throw new AppError(
            commonErrors.inputError,
            '비밀번호 형식(8~16자의 영문, 숫자, 특수문자)이 일치하지 않습니다.',
            400,
          );
        }
        const hashedPassword = await bcrypt.hash(newPassword, 15);
        updatedUser.password = hashedPassword;
      }
      await userDAO.updateById(user._id, updatedUser);
      return updatedUser;
    } catch (error) {
      throw new AppError(
        commonErrors.serverError,
        '개인정보 수정 중에 오류가 발생했습니다.',
        500,
      );
    }
  }

  // 모든 회원 정보 조회 메소드 (관리자)
  async getAllProfile() {
    try {
      const AllUserInfo = await userDAO.find();
      if (!AllUserInfo) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '정보할 회원 정보가 없습니다.',
          400,
        );
      }
      return AllUserInfo;
    } catch (error) {
      throw new AppError(
        commonErrors.serverError,
        '개인정보 조회 중에 오류가 발생했습니다.',
        500,
      );
    }
  }

  // 개인정보 조회 메소드
  async getProfile(email) {
    try {
      const user = await userDAO.findByEmail(email);
      if (!user) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '해당 이메일로 가입한 회원이 없습니다.',
          400,
        );
      }
      // 사용자 정보 반환 가능
      return {
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        address: user.address,
        addressDetail: user.addressDetail,
        role: user.role,
      };
    } catch (error) {
      throw new AppError(
        commonErrors.serverError,
        '개인정보 조회 중에 오류가 발생했습니다.',
        500,
      );
    }
  }

  // 개인정보 삭제 (회원탈퇴) 메소드
  async deleteProfile(email) {
    try {
      const user = await userDAO.findByEmail(email);
      if (!user) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          '해당 이메일로 가입한 회원이 없습니다.',
          400,
        );
      }
      await userDAO.deleteByEmail(email);
      return user;
    } catch (error) {
      throw new AppError(
        commonErrors.serverError,
        '개인정보 삭제 중에 오류가 발생했습니다.',
        500,
      );
    }
  }

  // 이메일 인증 발송 메소드
  async sendVerificationCode(toemail) {
    const transporter = createTransporter();

    function createTransporter() {
      return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: config.adminEmail, // 보내는 이메일 주소
          pass: config.adminPW, // 보내는 이메일 계정의 암호
        },
      });
    }
    // 랜덤한 6자리 숫자 생성
    const generateVerificationCode = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    let verificationCode = generateVerificationCode();

    const mailOptions = {
      from: 'honeytousedb@gmail.com', // 보내는 이메일 주소
      to: toemail, // 수신자 이메일 주소
      subject: '꿀단집 쇼핑몰 이메일 인증 코드', // 이메일 제목
      text: `인증 코드: ${verificationCode}`, // 이메일 내용
    };

    // 인증 코드 이메일 발송
    await transporter.sendMail(mailOptions);
    console.log('인증 코드 이메일이 성공적으로 전송되었습니다.');

    // DB의 EmailVerification모델에 해당 내역을 저장
    await EmailVerification.create({ email: toemail, verificationCode });

    return verificationCode;
  }

  // 이메일 인증 확인 메소드
  async verifyEmail(inputNumber, email) {
    try {
      // DB에서 해당 이메일의 인증 정보 가져오기
      const user = await EmailVerification.findOne({ email });

      // 해당 회원의  verificationCode 랑 inputNumber 비교
      const verificationCode = await user.verificationCode;

      // 입력한 번호와 저장된 인증 코드를 비교하여 일치하는지 확인
      if (inputNumber === verificationCode) {
        return '이메일이 성공적으로 인증되었습니다.';
      } else {
        throw new Error('이메일 인증 실패: 입력한 번호가 일치하지 않습니다.');
      }
    } catch (error) {
      throw new Error('이메일 인증 중에 오류가 발생했습니다.');
    }
  }

  // 새로운 비밀번호로 변경하는 메소드
  async changePassword(email, newPassword, newPasswordConfirm) {
    try {
      if (!isValidPassword(newPassword)) {
        throw new Error('비밀번호 형식이 올바르지 않습니다.');
      }
      if (newPassword !== newPasswordConfirm) {
        throw new Error('새로 입력한 비밀번호가 일치하지 않습니다.');
      }

      const user = await userDAO.findByEmail(email);

      if (!user) {
        throw new Error('해당 이메일을 가진 유저가 존재하지 않습니다.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 사용자 정보 업데이트
      await userDAO.updateById(user._id, { password: hashedPassword });

      return '비밀번호 변경을 완료하였습니다.';
    } catch (error) {
      throw new Error('비밀번호 변경 중 오류가 발생했습니다.');
    }
  }
}

// 회원가입 폼 유효성 검사

// 이름 유효성 검사
// ---> 한글 2~4자
function isValidName(name) {
  const nameRegex = /^[가-힣]{2,4}$/;
  return nameRegex.test(name);
}

// 이메일 유효성 검사
function isValidEmail(email) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;
  return emailRegex.test(email);
}

// 전화번호 유효성 검사
// ---> 010으로 시작하는 총 11자리 숫자
function isValidPhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^010\d{8}$/;
  return phoneNumberRegex.test(phoneNumber);
}

// 비밀번호 유효성 검사
// ---> 영문, 숫자, 특수문자를 조합하여 8-16자리를 입력
// 특수문자 가능한 것 : ! @ # $ % ^ & * ( ) - _ + = < > ?
function isValidPassword(plainPassword) {
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()-_+=<>?]{8,16}$/;
  return passwordRegex.test(plainPassword);
}

module.exports = new AuthService();
