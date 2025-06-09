const router = require("express").Router();
const blogController = require("../controllers/BlogController");

router.get("/", blogController.getAllBlog);
router.get("/:id", blogController.getBlogById);

module.exports = router;
