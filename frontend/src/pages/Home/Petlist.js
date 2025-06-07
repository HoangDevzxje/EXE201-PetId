import React, { useEffect, useState } from "react";
import api from "../../api/baseApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Container } from "react-bootstrap";
import "./PetList.css";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const { token, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const fetchPets = async () => {
      try {
        const res = await api.get("http://localhost:9999/pets");
        setPets(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thú cưng", err);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, [token, loading]);

  return (
    <div className="pet-list-container">
      <Container className="py-5">
        <Link to="/" className="btn btn-secondary mb-3">
          &larr; Quay lại trang chủ
        </Link>
        {/* Header Section */}

        <h1 className="display-4 mb-3">
          <i className="fas fa-paw me-3"></i>
          Thú cưng của tôi
        </h1>

        {/* Pets Section */}
        <section className="pets-section">
          {loadingPets ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">Đang tải danh sách thú cưng...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-icon mb-4">
                <i
                  className="fas fa-heart text-muted"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h3 className="mb-3">Chưa có thú cưng nào</h3>
              <p className="text-muted mb-4">
                Hãy tạo hồ sơ để bắt đầu quản lý thú cưng của bạn!
              </p>
              <Link to="/pets/manage" className="btn btn-primary btn-lg">
                <i className="fas fa-plus me-2"></i>
                Tạo hồ sơ thú cưng đầu tiên
              </Link>
            </div>
          ) : (
            <>
              <Row className="g-4">
                {pets.map((pet) => (
                  <Col key={pet._id} xs={12} sm={6} lg={4}>
                    <Link to={`/pets/${pet._id}`} className="pet-card-link">
                      <Card className="modern-pet-card h-100">
                        <div className="card-img-top-wrapper">
                          <Card.Img
                            variant="top"
                            src={pet.avatarUrl || "/images/default-pet.png"}
                            alt={pet.name}
                            onError={(e) => {
                              e.target.src = "/images/default-pet.png";
                            }}
                            className="modern-pet-avatar"
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="modern-pet-name">
                            {pet.name || "Chưa đặt tên"}
                          </Card.Title>
                          <p className="pet-species text-muted mb-2">
                            <i className="fas fa-tag me-1"></i>
                            {pet.species || "Chưa xác định"}
                          </p>
                          <hr className="modern-divider" />
                          <div className="modern-pet-info flex-grow-1">
                            <p className="mb-2">
                              <i className="fas fa-birthday-cake me-2 text-primary"></i>
                              <strong>Tuổi:</strong>{" "}
                              {pet.birthDate
                                ? (() => {
                                    const birth = new Date(pet.birthDate);
                                    const now = new Date();
                                    let years =
                                      now.getFullYear() - birth.getFullYear();
                                    let months =
                                      now.getMonth() - birth.getMonth();
                                    if (now.getDate() < birth.getDate())
                                      months--;
                                    if (months < 0) {
                                      years--;
                                      months += 12;
                                    }
                                    return `${years} tuổi${
                                      months > 0 ? ` ${months} tháng` : ""
                                    }`;
                                  })()
                                : "Không rõ"}
                            </p>
                            <p className="mb-2">
                              <i className="fas fa-weight me-2 text-success"></i>
                              <strong>Cân nặng:</strong> {pet.weightKg || "N/A"}{" "}
                              kg
                            </p>
                            <p className="mb-3">
                              <i
                                className={`fas ${
                                  pet.gender === "male"
                                    ? "fa-mars text-info"
                                    : "fa-venus text-danger"
                                } me-2`}
                              ></i>
                              <strong>Giới tính:</strong>{" "}
                              {pet.gender === "male"
                                ? "Đực"
                                : pet.gender === "female"
                                ? "Cái"
                                : "Không rõ"}
                            </p>
                          </div>
                          <div className="pet-actions mt-auto">
                            <div className="d-flex gap-2">
                              <Link
                                to={`/pets/${pet._id}/reminders`}
                                className="btn btn-outline-info btn-sm flex-fill"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="far fa-calendar-alt me-1"></i>
                                Lịch tiêm
                              </Link>
                              <Link
                                to={`/pets/${pet._id}`}
                                className="btn btn-primary btn-sm flex-fill"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="fas fa-eye me-1"></i>
                                Chi tiết
                              </Link>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </section>
      </Container>
    </div>
  );
};

export default PetList;
