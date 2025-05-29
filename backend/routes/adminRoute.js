const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.changeRoleUser);
router.put("/users/:id/status", adminController.changeStatusUser);
router.get("/products", adminController.getAllProducts);
router.post("/products", adminController.addNewProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

module.exports = router;
