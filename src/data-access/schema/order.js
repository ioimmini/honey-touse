const { Schema } = require('mongoose');

const orderSchema = new Schema(
  {
    //배송상태
    status: {
      type: String,
      required: true,
      enum: [
        '입금 대기',
        '결제 완료',
        '배송 준비',
        '배송 중',
        '배송 완료',
        '구매 확정',
      ],
    },
    //구매자
    customerId: {
      type: 'String'
    },
    //상품
    product: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      count: {
        type: Number,
        required: true,
      }
    }],
    //배송메모
    memo: {
        type: String,
      },
    // 결제금액
    payment: {
      //총 상품금액
      ttlPriceItem: {
        type: Number,
        required: true,
      },
      //총 배송비
      ttlPriceDelivery: {
        type: Number,
        default: 0
      },
      //총 결제금액
      ttlPrice: {
        type: Number,
        required: true,
      }
    },
    },
  {
    collection: 'Order',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = orderSchema;