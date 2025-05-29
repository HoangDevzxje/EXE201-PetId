import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/baseApi";
import petApi from "../../api/petApi";
import "./PetDetail.css";
const PetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${petId}`);
        setPet(res.data);
        setForm({
          name: res.data.name,
          species: res.data.species,
          breed: res.data.breed,
          gender: res.data.gender,
          birthDate: res.data.birthDate.split("T")[0],
          weightKg: res.data.weightKg,
          avatarFile: null,
          notes: res.data.notes || "",
        });
      } catch (err) {
        setPet(null);
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

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá hồ sơ thú cưng này?"))
      return;
    try {
      await petApi.delete(petId);
      setMessage("Đã xoá hồ sơ thú cưng");
      setTimeout(() => navigate("/"), 1000);
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

      const res = await petApi.update(petId, formData);
      setPet(res.data);
      setMessage("Đã cập nhật hồ sơ thú cưng");
      setEditing(false);
    } catch (err) {
      setMessage(
        "Lỗi: " + (err.response?.data?.message || "Không thể cập nhật hồ sơ")
      );
    }
  };

  if (loading) return <div className="text-center py-4">Đang tải...</div>;
  if (!pet)
    return <div className="text-center py-4">Không tìm thấy thú cưng.</div>;

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">
        &larr; Quay lại trang chủ
      </Link>

      {message && (
        <div
          className={`alert ${
            message.includes("Lỗi") ? "alert-danger" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      {editing ? (
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
                  onClick={() => setEditing(false)}
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
      ) : (
        <div className="row">
          {/* Phần ảnh */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm h-100">
              <img
                src={pet.avatarUrl || "/images/default-pet.png"}
                className="card-img-top"
                alt={pet.name}
                style={{
                  objectFit: "cover",
                  height: "400px",
                  borderRadius: "0.375rem 0.375rem 0 0",
                }}
              />
            </div>
          </div>

          {/* Phần thông tin */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <h1
                  className="card-title mb-4"
                  style={{ fontSize: "2.5rem", fontWeight: "bold" }}
                >
                  {pet.name}
                </h1>

                <div className="pet-info">
                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Giống:</div>
                    <div className="value-col">
                      {(pet.species === "dog"
                        ? "Chó"
                        : pet.species === "cat"
                        ? "Mèo"
                        : "Khác") +
                        " " +
                        pet.breed}
                    </div>
                  </div>

                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Tuổi:</div>
                    <div className="value-col">
                      {pet.birthDate
                        ? (() => {
                            const birth = new Date(pet.birthDate);
                            const now = new Date();

                            let years = now.getFullYear() - birth.getFullYear();
                            let months = now.getMonth() - birth.getMonth();
                            if (now.getDate() < birth.getDate()) months--;
                            if (months < 0) {
                              years--;
                              months += 12;
                            }

                            return `${years} tuổi${
                              months > 0 ? ` ${months} tháng` : ""
                            }`;
                          })()
                        : "Không rõ"}
                    </div>
                  </div>

                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Cân nặng:</div>
                    <div className="value-col">{pet.weightKg} kg</div>
                  </div>

                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Giới tính:</div>
                    <div className="value-col">
                      {pet.gender === "male"
                        ? "Đực"
                        : pet.gender === "female"
                        ? "Cái"
                        : "Không rõ"}
                    </div>
                  </div>

                  {pet.notes && (
                    <div className="info-row d-flex mb-3 pb-3">
                      <div className="label-col">Ghi chú:</div>
                      <div className="value-col text-muted">
                        <p className="mb-0">{pet.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="action-buttons mt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-warning me-2"
                  >
                    Chỉnh sửa
                  </button>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail;
