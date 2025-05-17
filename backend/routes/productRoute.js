const router = require("express").Router();
const productController = require("../controllers/ProductController");

// GET /api/products/main → danh sách sản phẩm (rút gọn cho trang chủ, danh mục, etc)
router.get("/main", productController.getAllProductCards);

// GET /api/products/detail/:productId → chi tiết 1 sản phẩm
router.get("/detail/:productId", productController.getProductDetailById);

router.get("/search", productController.searchProductsByName);
router.get("/featured", productController.getFeaturedProducts);
module.exports = router;
