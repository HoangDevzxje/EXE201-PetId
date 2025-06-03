const router = require("express").Router();
const ClinicController = require("../controllers/ClinicController");

// API cho người dùng
router.get("/clinics", ClinicController.getActiveClinics);
router.get("/clinics/:id", ClinicController.getClinicById);

module.exports = router;
