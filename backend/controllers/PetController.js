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

// Tạo hồ sơ thú cưng mới
const createPet = async (req, res) => {
  try {
    const avatarUrl = req.files?.avatar?.[0]
      ? `${req.protocol}://${req.get("host")}/uploads/${
          req.files.avatar[0].filename
        }`
      : undefined;

    const albumUrls = req.files?.album
      ? req.files.album.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        )
      : [];

    const newPet = new Pet({
      owner: req.user._id,
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      gender: req.body.gender,
      birthDate: new Date(req.body.birthDate),
      weightKg: parseFloat(req.body.weightKg),
      avatarUrl,
      notes: req.body.notes,
      hobbies: req.body.hobbies ? JSON.parse(req.body.hobbies) : [],
      restrictions: req.body.restrictions
        ? JSON.parse(req.body.restrictions)
        : [],
      dislikes: req.body.dislikes ? JSON.parse(req.body.dislikes) : [], // <-- thêm xử lý dislikes
      album: albumUrls,
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    console.error("Lỗi khi tạo hồ sơ thú cưng:", error);
    res
      .status(400)
      .json({ message: "Không thể tạo hồ sơ thú cưng", error: error.message });
  }
};

// Cập nhật hồ sơ thú cưng
const updatePet = async (req, res) => {
  try {
    const avatarUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    const updateData = {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      gender: req.body.gender,
      birthDate: new Date(req.body.birthDate),
      weightKg: parseFloat(req.body.weightKg),
      notes: req.body.notes,
      hobbies: req.body.hobbies
        ? req.body.hobbies.split(",").map((h) => h.trim())
        : [],
      restrictions: req.body.restrictions
        ? req.body.restrictions.split(",").map((r) => r.trim())
        : [],
      dislikes: req.body.dislikes
        ? req.body.dislikes.split(",").map((d) => d.trim())
        : [], // <-- thêm xử lý dislikes
      album: req.body.album
        ? req.body.album.split(",").map((a) => a.trim())
        : [],
    };

    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    const updatedPet = await Pet.findOneAndUpdate(
      { _id: req.params.petId, owner: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedPet) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thú cưng để cập nhật" });
    }

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Lỗi khi cập nhật thú cưng:", error);
    res.status(400).json({ message: "Không thể cập nhật thú cưng", error });
  }
};

// Xoá hồ sơ thú cưng
const deletePet = async (req, res) => {
  try {
    const deleted = await Pet.findOneAndDelete({
      _id: req.params.petId,
      owner: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thú cưng để xoá" });
    }

    res.status(200).json({ message: "Đã xoá thú cưng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá thú cưng", error });
  }
};

const uploadAlbum = async (req, res) => {
  try {
    // req.files là mảng file do multer xử lý
    const albumUrls = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    const updatedPet = await Pet.findOneAndUpdate(
      { _id: req.params.petId, owner: req.user._id },
      { $push: { album: { $each: albumUrls } } },
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ message: "Không tìm thấy thú cưng" });
    }

    res.status(200).json({
      message: "Album đã được cập nhật thành công!",
      album: updatedPet.album,
    });
  } catch (error) {
    console.error("Lỗi khi upload album:", error);
    res.status(500).json({ message: "Không thể upload album", error });
  }
};

module.exports = {
  getPetsByUser,
  getPetDetail,
  createPet,
  updatePet,
  deletePet,
  uploadAlbum,
};
