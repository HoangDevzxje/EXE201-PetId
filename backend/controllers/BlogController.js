const Blog = require("../models/Blog");

const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json(error);
  }
};

const blogController = {
  getAllBlog,
};

module.exports = blogController;
