import { useEffect, useState } from "react";
import petApi from "../../api/petApi";
import "./PetManagement.css";
import { Link, useNavigate } from "react-router-dom";

const PetManagement = () => {
  const [form, setForm] = useState({
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, avatarFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) {
        if (key === "avatarFile" && form.avatarFile) {
          formData.append("avatar", form.avatarFile);
        } else {
          formData.append(key, form[key]);
        }
      }

      await petApi.create(formData);
      setMessage("Đã tạo hồ sơ thú cưng mới");
      navigate("/");
    } catch (err) {
      setMessage(
        "Lỗi: " + (err.response?.data?.message || "Không thể lưu hồ sơ")
      );
    }
  };

  return (
    <div className="pet-management-container">
      <Link to="/" className="btn btn-secondary mb-3">
        &larr; Quay lại trang chủ
      </Link>
      <h2 className="title">Tạo hồ sơ thú cưng</h2>

      {message && <p className="message">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="form"
        encType="multipart/form-data"
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Tên thú cưng</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label>Loài</label>
            <select
              name="species"
              value={form.species}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">-- Chọn loài --</option>
              <option value="dog">Chó</option>
              <option value="cat">Mèo</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label>Giống loài</label>
            <input
              name="breed"
              value={form.breed}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
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
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg)</label>
            <input
              name="weightKg"
              type="number"
              value={form.weightKg}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label>Ảnh đại diện</label>
            <input
              name="avatar"
              type="file"
              onChange={handleChange}
              className="input"
              accept="image/*"
            />
          </div>
          <div className="form-group full-width">
            <label>Ghi chú</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Tạo hồ sơ
        </button>
      </form>
    </div>
  );
};

export default PetManagement;
