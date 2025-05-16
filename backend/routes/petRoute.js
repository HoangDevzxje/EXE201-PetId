const router = require("express").Router();
const PetController = require("../controllers/PetController");
const { checkAuthorize } = require("../middleware/authMiddleware");

// Lấy danh sách thú cưng của user
router.get("/", checkAuthorize(["user"]), PetController.getPetsByUser);

// Lấy chi tiết một thú cưng
router.get("/:petId", checkAuthorize(["user"]), PetController.getPetDetail);

module.exports = router;
