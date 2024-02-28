const mongoose = require('mongoose');
const { optionSchema } = require('../schema');

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;
