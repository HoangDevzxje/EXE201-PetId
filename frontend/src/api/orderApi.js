import api from "./baseApi";

const orderApi = {
  // Lấy tất cả đơn hàng của người dùng
  getAll: async () => {
    return await api.get("/orders");
  },

  // Lấy chi tiết đơn hàng theo ID
  getById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // Tạo đơn hàng mới
  create: async (data) => {
    return await api.post("/orders", data);
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (orderId, status) => {
    return await api.put(`/orders/${orderId}/status`, { status });
  },
};

export default orderApi;
