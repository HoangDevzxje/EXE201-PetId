const router = require("express").Router();
const PetController = require("../controllers/PetController");
const { checkAuthorize } = require("../middleware/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", checkAuthorize(["user"]), PetController.getPetsByUser);
router.get("/:petId", checkAuthorize(["user"]), PetController.getPetDetail);
router.post(
  "/",
  checkAuthorize(["user"]),
  upload.single("avatar"),
  PetController.createPet
);
router.put(
  "/:petId",
  checkAuthorize(["user"]),
  upload.single("avatar"),
  PetController.updatePet
);
router.delete("/:petId", checkAuthorize(["user"]), PetController.deletePet);

module.exports = router;
