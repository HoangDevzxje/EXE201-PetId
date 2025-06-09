const Blog = require("../models/Blog");

const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json(error);
  }
};

const blogController = {
  getAllBlog,
  getBlogById,
};

module.exports = blogController;
