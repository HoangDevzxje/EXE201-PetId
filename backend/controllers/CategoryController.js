const Category = require("../models/Category");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("_id name description");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllCategories,
};
