const Product = require("../models/Product");

// Lấy danh sách tất cả sản phẩm (dạng rút gọn)
const getAllProductCards = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select("_id name price imageUrl category")
      .populate("category", "name"); // chỉ lấy tên category
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Lấy chi tiết 1 sản phẩm
const getProductDetailById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "category",
      "name description"
    );
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const productController = {
  getAllProductCards,
  getProductDetailById,
};

module.exports = productController;
