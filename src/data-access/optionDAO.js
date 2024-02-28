const { Option } = require('./model');

class OptionDAO {
  async create({ name, value }) {
    const option = new Option({ name, value });
    await option.save();

    return option.toObject();
  }
  async findMany() {
    const options = await Option.find().lean();
    return options;
  }
  async findById(id) {
    const option = await Option.findById(id).lean();
    return option;
  }

  async findRawById(id) {
    const option = await Option.findById(id).lean();
    return option;
  }

  async updateById(id, { name, value }) {
    const updatedOption = await Option.findByIdAndUpdate(
      id,
      {
        name,
        value,
      },
      {
        runValidators: true,
        new: true,
      },
    ).lean();
    return updatedOption;
  }

  async deleteById(id) {
    const deletedOption = await Option.findByIdAndDelete(id).lean();
    return deletedOption;
  }
}

module.exports = new OptionDAO();
