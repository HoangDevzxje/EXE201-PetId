const Pet = require("../models/Pet");

// Lấy danh sách thú cưng của người dùng
const getPetsByUser = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Lấy chi tiết thú cưng
const getPetDetail = async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.petId,
      owner: req.user._id,
    });
    if (!pet)
      return res.status(404).json({ message: "Không tìm thấy thú cưng" });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getPetsByUser,
  getPetDetail,
};
