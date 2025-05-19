import api from "./baseApi";

const reminderApi = {
  // Lấy tất cả reminder của user
  getAll: async () => {
    return await api.get("/reminders");
  },

  // Lấy reminder theo pet cụ thể
  getByPet: async (petId) => {
    return await api.get(`/reminders/pet/${petId}`);
  },

  // Tạo mới reminder
  create: async (data) => {
    return await api.post("/reminders", data);
  },

  // Cập nhật reminder
  update: async (reminderId, data) => {
    return await api.put(`/reminders/${reminderId}`, data);
  },

  // Xoá reminder
  delete: async (reminderId) => {
    return await api.delete(`/reminders/${reminderId}`);
  },
};

export default reminderApi;
