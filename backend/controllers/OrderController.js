const Order = require("../models/Order");

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product",
      "name price imageUrl"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    }).populate("items.product");
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user._id },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái", error: err });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, contactPhone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không được để trống" });
    }

    if (!shippingAddress || !contactPhone) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp địa chỉ và số điện thoại." });
    }

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      status: "pending",
      shippingAddress,
      contactPhone,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Tạo đơn hàng thất bại", error: err });
  }
};

module.exports = {
  getOrdersByUser,
  getOrderDetail,
  updateOrderStatus,
  createOrder,
};
