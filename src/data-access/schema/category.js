const { Schema } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'Category', // Category라는 이름의 컬랙션에 저장하기 위해 명시적으로 기입, 이 부분이 빠지면 mongoose는 categorys라는 복수형 lowercase 알파벳 이름으로 컬랙션을 생성해버림
    versionKey: false,
    timestamps: false,
  },
);

module.exports = categorySchema;
