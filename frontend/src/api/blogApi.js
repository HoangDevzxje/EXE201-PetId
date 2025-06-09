import api from "./baseApi";

const blogApi = {
  // Get all blogs (public)
  getAll: async () => {
    const response = await api.get("/blogs");
    return response;
  },

  // Admin: Add new blog
  addNewBlog: async (blogData) => {
    const response = await api.post("/admin/blogs", blogData);
    return response;
  },

  // Admin: Update blog by ID
  updateBlogById: async (id, blogData) => {
    const response = await api.put(`/admin/blogs/${id}`, blogData);
    return response;
  },

  // Admin: Delete blog by ID
  deleteBlogById: async (id) => {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response;
  },
};

export default blogApi;
