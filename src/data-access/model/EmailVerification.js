const mongoose = require('mongoose');
const { emailVerificationSchema } = require('../schema');

const EmailVerification = mongoose.model(
  'EmailVerification',
  emailVerificationSchema,
);

module.exports = EmailVerification;
