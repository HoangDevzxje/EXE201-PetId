import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/baseApi";
import petApi from "../../api/petApi";
import "./PetDetail.css";

const PetEdit = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "unknown",
    birthDate: "",
    weightKg: "",
    avatarFile: null,
    notes: "",
    hobbies: "",
    restrictions: "",
    dislikes: "", // Thêm trường sở ghét
    album: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${petId}`);
        setForm({
          name: res.data.name || "",
          species: res.data.species || "",
          breed: res.data.breed || "",
          gender: res.data.gender || "unknown",
          birthDate: res.data.birthDate ? res.data.birthDate.split("T")[0] : "",
          weightKg: res.data.weightKg || "",
          avatarFile: null,
          notes: res.data.notes || "",
          hobbies: res.data.hobbies ? res.data.hobbies.join(", ") : "",
          restrictions: res.data.restrictions
            ? res.data.restrictions.join(", ")
            : "",
          dislikes: res.data.dislikes ? res.data.dislikes.join(", ") : "",
          album: res.data.album ? res.data.album.join(", ") : "",
        });
      } catch (err) {
        setMessage("Không tìm thấy thú cưng.");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

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
        } else if (key !== "avatarFile") {
          formData.append(key, form[key]);
        }
      }
      const res = await petApi.update(petId, formData);
      setMessage("Đã cập nhật hồ sơ thú cưng");
      setTimeout(() => navigate(`/pets/${petId}`), 1000);
    } catch (err) {
      setMessage(
        "Lỗi: " + (err.response?.data?.message || "Không thể cập nhật hồ sơ")
      );
    }
  };

  if (loading) return <div className="text-center py-4">Đang tải...</div>;
  if (message === "Không tìm thấy thú cưng.")
    return <div className="text-center py-4">{message}</div>;

  return (
    <div className="container mt-4">
      <Link to={`/pets/${petId}`} className="btn btn-secondary mb-3">
        &larr; Quay lại chi tiết thú cưng
      </Link>
      {message && message !== "Không tìm thấy thú cưng." && (
        <div
          className={`alert ${
            message.includes("Lỗi") ? "alert-danger" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Tên thú cưng</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Loài</label>
                  <select
                    name="species"
                    value={form.species}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="dog">Chó</option>
                    <option value="cat">Mèo</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Giống loài</label>
                  <input
                    name="breed"
                    value={form.breed}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="male">Đực</option>
                    <option value="female">Cái</option>
                    <option value="unknown">Không rõ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Sở thích</label>
                  <input
                    name="hobbies"
                    value={form.hobbies}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="VD: Chạy nhảy, cắn đồ chơi"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sở ghét</label>
                  <input
                    name="dislikes"
                    value={form.dislikes}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="VD: Không thích ồn ào, không thích tắm"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dị ứng</label>
                  <input
                    name="restrictions"
                    value={form.restrictions}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="VD: Không ăn đồ ngọt"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cân nặng (kg)</label>
                  <input
                    name="weightKg"
                    type="number"
                    value={form.weightKg}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ảnh đại diện</label>
                  <input
                    name="avatar"
                    type="file"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Album ảnh (dán link, cách nhau dấu phẩy)
                  </label>
                  <input
                    name="album"
                    value={form.album}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://...jpg, https://...png"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Ghi chú</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/pets/${petId}`)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetEdit;
