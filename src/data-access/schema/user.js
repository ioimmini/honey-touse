const { Schema } = require('mongoose');

const userSchema = new Schema(
  {
    // 이름
    name: {
      type: String,
      required: true,
    },

    // 연락처
    phoneNumber: {
      type: String,
      required: true,
    },

    // 주소
    address: {
      type: String,
      required: true,
    },

    //상세주소
    addressDetail: {
      type: String,
      required: true,
    },

    // 이메일 주소
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // 비밀번호
    password: {
      type: String,
      required: true,
    },

    // 계정구분 (유저 혹은 관리자)
    // 관리자(admin)인 경우 '/admin' url로 접속하여 관리자 페이지 이용 가능함
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'], // 해당 필드에 대한 값 제한
    },
  },
  {
    collection: 'User',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = userSchema;
