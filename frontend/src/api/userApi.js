import api from "./baseApi";

const userApi = {
  // Get all user
  getAllUser: async () => {
    const url = `admin/users`;
    const response = await api.get(url);
    return response;
  },

  // Change role user
  updateUserRole: async (id) => {
    const url = `admin/users/${id}/change-role`;
    const response = await api.put(url);
    return response;
  },
  // Change status user
  updateUserStatus: async (id) => {
    const url = `admin/users/${id}/change-status`;
    const response = await api.put(url);
    return response;
  },
};

export default userApi;
