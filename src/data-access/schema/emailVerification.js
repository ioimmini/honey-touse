const { Schema } = require('mongoose');

const emailVerificationSchema = new Schema(
  {
    // 전송요청한 이메일
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // 서버에서 발송한 인증 번호
    verificationCode: {
      type: String,
      required: true,
    },

    // 생성 시각
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '5m', // 5분 후에 문서가 자동으로 삭제되도록 설정
    },
  },
  {
    collection: 'EmailVerification',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = emailVerificationSchema;
