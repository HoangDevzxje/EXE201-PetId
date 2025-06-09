const router = require("express").Router();
const blogController = require("../controllers/BlogController");

router.get("/", blogController.getAllBlog);

module.exports = router;
