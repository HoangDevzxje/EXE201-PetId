import React, { useEffect, useState } from "react";
import api from "../../api/baseApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const { token, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const fetchPets = async () => {
      try {
        const res = await api.get("/pets");
        setPets(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thú cưng", err);
      }
    };

    fetchPets();
  }, [token, loading]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"> Thú cưng của tôi</h2>
        <Link
          to="/pets"
          className="btn"
          style={{
            backgroundColor: "#C49A6C",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            textDecoration: "none",
          }}
        >
          Tạo hồ sơ thú cưng
        </Link>
      </div>
      {pets.length === 0 ? (
        <div className="text-muted">Chưa có thú cưng nào được thêm.</div>
      ) : (
        <div className="row">
          {pets.map((pet) => (
            <div className="col-md-4 mb-4" key={pet._id}>
              <div className="card shadow-sm h-100">
                <img
                  src={pet.avatarUrl}
                  className="card-img-top"
                  alt={pet.name}
                  style={{
                    height: 250,
                    objectFit: "cover",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ color: "#C49A6C" }}>
                    {pet.name}
                  </h5>

                  <p className="card-text mb-4">
                    <strong>Loài:</strong> {pet.species} <br />
                    <strong>Giống:</strong> {pet.breed} <br />
                    <strong>Cân nặng:</strong> {pet.weightKg} kg
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/pets/${pet._id}`}
                      className="btn"
                      style={{
                        backgroundColor: "#C49A6C",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        fontWeight: "500",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        transition: "0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#A67C52";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#C49A6C";
                      }}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPets;
