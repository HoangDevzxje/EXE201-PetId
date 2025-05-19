import api from "./baseApi";

const petApi = {
  getAll: async () => {
    const url = "/pets";
    return await api.get(url);
  },

  getById: async (id) => {
    const url = `/pets/${id}`;
    return await api.get(url);
  },

  create: async (formData) => {
    const url = "/pets";
    return await api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: async (id, formData) => {
    const url = `/pets/${id}`;
    return await api.put(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: async (id) => {
    const url = `/pets/${id}`;
    return await api.delete(url);
  },
};

export default petApi;
