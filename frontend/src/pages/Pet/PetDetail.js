import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/baseApi";

const PetDetail = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
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

  if (loading) return <div>Đang tải...</div>;
  if (!pet) return <div>Không tìm thấy thú cưng.</div>;

  return (
    <div className="container mt-4">
      <Link to="/my-pets" className="btn btn-secondary mb-2">
        &larr; Quay lại
      </Link>
      <div
        className="pet-card-detail mx-auto shadow-sm border rounded-4 overflow-hidden"
        style={{ maxWidth: 500, backgroundColor: "#FFF" }}
      >
        <img
          src={pet.avatarUrl || "/default-pet.png"}
          className="w-100"
          alt={pet.name}
          style={{ objectFit: "cover", height: 300 }}
        />
        <div className="p-4">
          <h3 className="mb-3 text-center ">{pet.name}</h3>
          <ul className="list-group list-group-flush rounded-3 border">
            <li className="list-group-item">
              <strong>Loài:</strong> {pet.species}
            </li>
            <li className="list-group-item">
              <strong>Giống:</strong> {pet.breed}
            </li>
            <li className="list-group-item">
              <strong>Giới tính:</strong>{" "}
              {pet.gender === "male"
                ? "Đực"
                : pet.gender === "female"
                ? "Cái"
                : "Không rõ"}
            </li>
            <li className="list-group-item">
              <strong>Ngày sinh:</strong>{" "}
              {new Date(pet.birthDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </li>
            <li className="list-group-item">
              <strong>Cân nặng:</strong> {pet.weightKg} kg
            </li>
            <li className="list-group-item">
              <strong>Ghi chú:</strong> {pet.notes || "Không có"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
