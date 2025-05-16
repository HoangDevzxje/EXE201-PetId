const router = require("express").Router();
const CategoryController = require("../controllers/CategoryController");

// Lấy tất cả danh mục sản phẩm đang hoạt động
router.get("/", CategoryController.getAllCategories);

module.exports = router;
