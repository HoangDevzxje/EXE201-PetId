import { useEffect, useState } from "react";
import petApi from "../../api/petApi";
import "./PetProfileManager.css";
import { Link, useNavigate } from "react-router-dom";

export default function PetProfileManager() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    species: "",
    breed: "",
    gender: "unknown",
    birthDate: "",
    weightKg: "",
    avatarFile: null,
    notes: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchPets = async () => {
    try {
      const res = await petApi.getAll();
      setPets(res.data);
    } catch {
      setMessage("Không thể tải danh sách thú cưng");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, avatarFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (pet) => {
    setForm({ ...pet, avatarFile: null });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá hồ sơ thú cưng này?"))
      return;
    try {
      await petApi.delete(id);
      setMessage("Đã xoá hồ sơ thú cưng");
      fetchPets();
    } catch (err) {
      setMessage(
        "Lỗi: " + (err.response?.data?.message || "Không thể xoá hồ sơ")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) {
        if (key === "avatarFile" && form.avatarFile) {
          formData.append("avatar", form.avatarFile);
        } else if (key !== "avatarFile") {
          formData.append(key, form[key]);
        }
      }

      if (form._id) {
        await petApi.update(form._id, formData);
        setMessage("Đã cập nhật hồ sơ thú cưng");
      } else {
        await petApi.create(formData);
        setMessage("Đã tạo hồ sơ thú cưng mới");
      }

      setForm({
        _id: null,
        name: "",
        species: "",
        breed: "",
        gender: "unknown",
        birthDate: "",
        weightKg: "",
        avatarFile: null,
        notes: "",
      });

      fetchPets();
    } catch (err) {
      setMessage(
        "Lỗi: " + (err.response?.data?.message || "Không thể lưu hồ sơ")
      );
    }
  };

  return (
    <div className="pet-manager-container">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Quay lại
      </button>
      <h2 className="title">Quản lý hồ sơ thú cưng</h2>

      {message && <p className="error-message">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="form"
        encType="multipart/form-data"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên thú cưng"
          className="input"
          required
        />
        <select
          name="species"
          value={form.species}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">-- Loài --</option>
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
          <option value="other">Khác</option>
        </select>
        <input
          name="breed"
          value={form.breed}
          onChange={handleChange}
          placeholder="Giống loài"
          className="input"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
        >
          <option value="male">Đực</option>
          <option value="female">Cái</option>
          <option value="unknown">Không rõ</option>
        </select>
        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="weightKg"
          type="number"
          value={form.weightKg}
          onChange={handleChange}
          placeholder="Cân nặng (kg)"
          className="input"
          required
        />
        <input
          name="avatar"
          type="file"
          onChange={handleChange}
          className="input"
          accept="image/*"
        />
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Ghi chú thêm..."
          className="input"
        />
        <button type="submit" className="submit-button">
          {form._id ? "Cập nhật hồ sơ" : "Tạo hồ sơ"}
        </button>
      </form>

      <div className="pet-list">
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card">
            <div className="pet-info">
              <img
                src={pet.avatarUrl || "/default-pet.png"}
                alt={pet.name}
                className="pet-avatar"
              />
              <div>
                <h3 className="pet-name">{pet.name}</h3>
                <p className="pet-desc">
                  {pet.species} - {pet.breed}
                </p>
                <p className="pet-desc">
                  {pet.gender === "male"
                    ? "Đực"
                    : pet.gender === "female"
                    ? "Cái"
                    : "Không rõ"}{" "}
                  • {pet.weightKg}kg
                </p>
              </div>
              <div className="pet-actions">
                <button onClick={() => handleEdit(pet)} className="edit-button">
                  Chỉnh sửa
                </button>
                <Link
                  to={`/pets/${pet._id}/reminders`}
                  className="reminder-link"
                >
                  Xem lịch tiêm
                </Link>

                <button
                  onClick={() => handleDelete(pet._id)}
                  className="delete-button"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
