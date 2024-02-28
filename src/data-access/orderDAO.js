const { Order } = require('./model');

class OrderDAO {
  async create({ status, customerId, product, memo, payment }) {
    const order = new Order({ status, customerId, product, memo, payment });
    await order.save();
    return order.toObject();
  }

  async findById(id) {
    const order = await Order.findById(id).populate('product').lean();
    return order;
  }

  // 전체 주문 조회
  async findMany() {
    const orders = await Order.find().lean();
    return orders;
  }

  // 구매자 ID로 주문내역 조회
  async findByCustomerId(customerId) {
    const orders = await Order.find({ customerId })
      .populate('customerId')
      .lean();
    return orders;
  }
  async getOrdersByStatus(status) {
    // 주어진 상태(status)에 해당하는 주문 목록 조회
    const orders = await Order.find({ status: status })
      .populate('status')
      .lean();
    return orders;
  }

  async updateOne(id, { status, customerId, product, memo, payment }) {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        customerId,
        product,
        memo,
        payment
      },
      {
        runValidators: true,
        new: true,
      },
    ).lean();
    return updatedOrder;
  }

  async deleteOne(id) {
    const deletedOrder = await Order.findByIdAndDelete(id).lean();
    return deletedOrder;
  }
}

module.exports = new OrderDAO();
