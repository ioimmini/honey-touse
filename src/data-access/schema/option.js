const { Schema } = require('mongoose');

const optionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String],
      required: true,
    },
  },
  {
    collection: 'Option',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = optionSchema;
