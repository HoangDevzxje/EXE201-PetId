const Clinic = require("../models/Clinic");

// Lấy danh sách phòng khám đang hoạt động (isActive = true)
const getActiveClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({ isActive: true });
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic || !clinic.isActive) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json(clinic);
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = {
  getActiveClinics,
  getClinicById,
};
