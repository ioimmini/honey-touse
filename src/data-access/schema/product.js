const { Schema } = require('mongoose');

const productSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    options: {
      type: Schema.Types.ObjectId,
      ref: 'Option',
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'Product',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = productSchema;
