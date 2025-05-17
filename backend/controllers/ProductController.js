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

const searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
    }

    const products = await Product.find({
      isActive: true,
      name: { $regex: name, $options: "i" }, // tìm không phân biệt hoa thường
    })
      .select("_id name price imageUrl category")
      .populate("category", "name");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .select("_id name price imageUrl category")
      .populate("category", "name");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

const productController = {
  getAllProductCards,
  getProductDetailById,
  searchProductsByName,
  getFeaturedProducts,
};

module.exports = productController;
