import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/baseApi";
import "./PetDetail.css";

const PetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        // Nếu backend có populate clinic, sẽ nhận object clinic
        const res = await api.get(`/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        setPet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xoá thú cưng này?");
    if (!confirmed) return;

    try {
      await api.delete(`/pets/${petId}`);
      alert("Đã xoá thú cưng thành công");
      navigate("/pets");
    } catch (err) {
      console.error("Lỗi khi xoá thú cưng:", err);
      alert("Xoá thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) return <div className="text-center py-4">Đang tải...</div>;
  if (!pet)
    return <div className="text-center py-4">Không tìm thấy thú cưng.</div>;

  // Tính tuổi thú cưng
  const getAgeText = () => {
    if (!pet.birthDate) return "Không rõ";
    const birth = new Date(pet.birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (now.getDate() < birth.getDate()) months--;
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} tuổi${months > 0 ? ` ${months} tháng` : ""}`;
  };

  return (
    <div className="container mt-4">
      <Link to="/pets" className="btn btn-secondary mb-3">
        &larr; Quay lại danh sách thú cưng
      </Link>
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
                cursor: "pointer",
              }}
              onClick={() => pet.avatarUrl && setSelectedImage(pet.avatarUrl)}
            />
            {/* Hiển thị album nếu có */}
            {pet.album && pet.album.length > 0 && (
              <div className="pet-album mt-3 px-3 pb-3">
                <div className="fw-bold mb-2">Album ảnh:</div>
                <div className="d-flex flex-wrap gap-2">
                  {pet.album.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`pet-album-${idx}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </div>
            )}
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
              <Link
                to={`/pets/${petId}/reminders`}
                className="btn btn-outline-info btn-sm d-inline-flex align-items-center"
                onClick={(e) => e.stopPropagation()}
                style={{
                  minWidth: 110,
                  fontWeight: 500,
                  borderRadius: "18px",
                  padding: "6px 18px",
                  fontSize: "1.1rem",
                  gap: 8,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <i
                  className="far fa-calendar-alt"
                  style={{ fontSize: "1.2rem", marginRight: 8 }}
                />
                Lịch tiêm
              </Link>

              <Link
                to={`/pets/${petId}/emotion`}
                className="btn btn-outline-info btn-sm d-inline-flex align-items-center"
                onClick={(e) => e.stopPropagation()}
                style={{
                  minWidth: 110,
                  fontWeight: 500,
                  borderRadius: "18px",
                  padding: "6px 18px",
                  fontSize: "1.1rem",
                  gap: 8,
                  marginLeft: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <i
                  className="fas fa-smile"
                  style={{ fontSize: "1.2rem", marginRight: 8 }}
                />
                Nhật kí hoạt động thú cưng
              </Link>
              <div style={{ marginBottom: 18 }}></div>
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
                      (pet.breed || "")}
                  </div>
                </div>
                <div className="info-row d-flex mb-3 pb-3 border-bottom">
                  <div className="label-col">Tuổi:</div>
                  <div className="value-col">{getAgeText()}</div>
                </div>
                <div className="info-row d-flex mb-3 pb-3 border-bottom">
                  <div className="label-col">Cân nặng:</div>
                  <div className="value-col">
                    {pet.weightKg ? pet.weightKg + " kg" : "Không rõ"}
                  </div>
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

                {/* Sở thích */}
                {pet.hobbies && pet.hobbies.length > 0 && (
                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Sở thích:</div>
                    <div className="value-col">{pet.hobbies.join(", ")}</div>
                  </div>
                )}

                {/* Sở ghét */}
                {pet.dislikes && pet.dislikes.length > 0 && (
                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Sở ghét:</div>
                    <div className="value-col">{pet.dislikes.join(", ")}</div>
                  </div>
                )}

                {/* Dị ứng */}
                {pet.restrictions && pet.restrictions.length > 0 && (
                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Dị ứng:</div>
                    <div className="value-col">
                      {pet.restrictions.join(", ")}
                    </div>
                  </div>
                )}

                {/* Ghi chú */}
                {pet.notes && (
                  <div className="info-row d-flex mb-3 pb-3">
                    <div className="label-col">Ghi chú:</div>
                    <div className="value-col text-muted">
                      <p className="mb-0">{pet.notes}</p>
                    </div>
                  </div>
                )}

                {/* Phòng khám */}
                {pet.clinic && (
                  <div className="info-row d-flex mb-3 pb-3 border-bottom">
                    <div className="label-col">Phòng khám:</div>
                    <div className="value-col">
                      {typeof pet.clinic === "object"
                        ? pet.clinic.name
                        : "Phòng khám đã liên kết"}
                    </div>
                  </div>
                )}

                {/* Hồ sơ tiêm chủng */}
                {pet.vaccinationRecords &&
                  pet.vaccinationRecords.length > 0 && (
                    <div className="info-row mb-4">
                      <div className="fw-bold mb-2">📌 Hồ sơ tiêm chủng:</div>
                      <ul className="list-group">
                        {pet.vaccinationRecords.map((vaccine, idx) => (
                          <li className="list-group-item" key={idx}>
                            <strong>{vaccine.vaccineName}</strong> –{" "}
                            {new Date(vaccine.date).toLocaleDateString("vi-VN")}
                            {vaccine.nextDoseDue && (
                              <>
                                {" "}
                                | Mũi kế tiếp:{" "}
                                {new Date(
                                  vaccine.nextDoseDue
                                ).toLocaleDateString("vi-VN")}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Lịch sử y tế */}
                {pet.medicalHistory && pet.medicalHistory.length > 0 && (
                  <div className="info-row mb-4">
                    <div className="fw-bold mb-2">🩺 Lịch sử y tế:</div>
                    <ul className="list-group">
                      {pet.medicalHistory.map((record, idx) => (
                        <li className="list-group-item" key={idx}>
                          <div>
                            <strong>Ngày:</strong>{" "}
                            {new Date(record.date).toLocaleDateString("vi-VN")}
                          </div>
                          <div>
                            <strong>Mô tả:</strong> {record.description}
                          </div>
                          {record.vet && (
                            <div>
                              <strong>Bác sĩ:</strong> {record.vet}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="action-buttons mt-4">
                <Link
                  to={`/pets/${petId}/edit`}
                  className="btn btn-warning me-2"
                >
                  Chỉnh sửa
                </Link>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem ảnh */}
      {selectedImage && (
        <div
          className="modal d-block"
          onClick={() => setSelectedImage(null)}
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedImage}
            alt="Xem ảnh"
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PetDetail;
