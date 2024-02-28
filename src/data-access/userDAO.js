const { User } = require('./model');

class UserDAO {
  // DB에 새로운 사용자를 정의하는 메소드
  async create({
    name,
    phoneNumber,
    address,
    addressDetail,
    email,
    password,
    role,
  }) {
    // DB에 새로운 사용자 생성 후 일반 JavaScript 객체로 변환
    const user = await User.create({
      name,
      phoneNumber,
      address,
      addressDetail,
      email,
      password,
      role,
    });
    return user;
  }
  // DB에서 모든 사용자를 찾는 메소드
  async find() {
    const users = await User.find().lean();
    return users;
  }
  // DB에서 ID에 해당하는 사용자를 찾는 메소드
  async findById(id) {
    const user = await User.findById(id).lean();
    return user;
  }
  // DB에서 Email에 해당하는 사용자를 찾는 메소드
  async findByEmail(email) {
    const user = await User.findOne({ email }).lean();
    return user;
  }
  // DB에서 ID에 해당하는 사용자 정보를 업데이트하는 메소드
  async updateById(id, { email, address, addressDetail, password, role }) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        password,
        address,
        addressDetail,
        role,
      },
      {
        runValidators: true,
        new: true,
      },
    ).lean();
    return updatedUser;
  }
  // DB에서 ID에 해당하는 사용자 정보를 삭제하는 메소드
  async deleteById(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  }
  // DB에서 이메일에 해당하는 사용자 정보를 삭제하는 메소드
  async deleteByEmail(email) {
    const deletedUser = await User.findOneAndDelete(email);
    return deletedUser;
  }
}

module.exports = new UserDAO();
