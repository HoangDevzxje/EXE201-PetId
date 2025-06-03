import React, { useEffect, useState } from "react";
import api from "../../api/baseApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Carousel, Container } from "react-bootstrap";
import "./Home.css";
// import Slider from "react-slick"; // Removed, as it's not being used in the current structure
// import "slick-carousel/slick/slick.css"; // Removed, as it's not being used
// import "slick-carousel/slick/slick-theme.css"; // Removed, as it's not being used

const Home = () => {
  const [pets, setPets] = useState([]);
  const [products, setProducts] = useState([]); // Kept for future product section
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true); // Kept for future product section
  const { token, loading } = useAuth();

  // Banner images data
  const bannerImages = [
    {
      url: "https://aquariumcare.vn/upload/user/images/ch%E1%BB%A5p%20%E1%BA%A3nh%20ch%C3%B3%20m%C3%A8o%20%C4%91%E1%BA%B9p%20v%C3%A0%20%C4%91%C3%A1ng%20y%C3%AAu%203.jpg",
      alt: "Golden retriever and cat",
      title: "Chào mừng đến với PetID+",
      subtitle: "Nơi hỗ trợ sức khỏe cho thú cưng của bạn",
    },
    {
      url: "https://aquariumcare.vn/upload/user/images/ch%E1%BB%A5p%20%E1%BA%A3nh%20ch%C3%B3%20m%C3%A8o%20%C4%91%E1%BA%B9p%20v%C3%A0%20%C4%91%C3%A1ng%20y%C3%AAu%203.jpg",
      alt: "Dog and cat together",
      title: "Chăm sóc toàn diện",
      subtitle: "Dịch vụ chăm sóc thú cưng chất lượng cao",
    },
    {
      url: "https://aquariumcare.vn/upload/user/images/ch%E1%BB%A5p%20%E1%BA%A3nh%20ch%C3%B3%20m%C3%A8o%20%C4%91%E1%BA%B9p%20v%C3%A0%20%C4%91%C3%A1ng%20y%C3%AAu%203.jpg",
      alt: "Cute dog and cat",
      title: "Phụ kiện đa dạng",
      subtitle: "Những sản phẩm tốt nhất cho thú cưng của bạn",
    },
  ];

  useEffect(() => {
    if (loading) return;

    const fetchPets = async () => {
      try {
        const res = await api.get("/pets");
        setPets(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thú cưng", err);
      } finally {
        setLoadingPets(false);
      }
    };

    const fetchProducts = async () => {
      try {
        // Assuming /products/featured exists and returns featured products
        const res = await api.get("/products/featured");
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchPets();
    fetchProducts();
  }, [token, loading]);

  return (
    <div className="home-container">
      {/* Full-screen Banner Carousel */}
      <section className="hero-section">
        <Carousel
          fade
          interval={4000}
          controls={false}
          indicators={true}
          pause={false}
        >
          {bannerImages.map((slide, index) => (
            <Carousel.Item key={index}>
              <div className="hero-slide">
                <img
                  className="d-block w-100 hero-img"
                  src={slide.url}
                  alt={slide.alt}
                />
                <div className="hero-overlay" />{" "}
                {/* Kept for consistent overlay */}
                <div className="hero-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      <div className="main-content container">
        {" "}
        {/* Added a wrapper for main content */}
        {/* My Pets Section */}
        <section className="pets-section mt-5">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-paw me-2"></i>Thú cưng của tôi
            </h2>
            <Link to="/pets/manage" className="btn btn-primary create-pet-btn">
              {" "}
              {/* Changed button class */}
              Tạo hồ sơ thú cưng
            </Link>
          </div>

          {loadingPets ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />{" "}
              {/* Changed spinner variant */}
            </div>
          ) : pets.length === 0 ? (
            <div className="empty-state">
              <p>
                Hãy đăng nhập để xem thông tin hoặc tạo hồ sơ cho thú cưng của
                bạn!
              </p>
              <Link to="/login" className="btn btn-outline-primary">
                {" "}
                {/* Changed button variant */}
                Đăng nhập
              </Link>
            </div>
          ) : (
            <Row className="g-4 justify-content-center">
              {" "}
              {/* Added justify-content-center */}
              {pets.slice(0, 3).map((pet) => (
                <Col key={pet._id} xs={12} sm={6} md={4}>
                  {" "}
                  {/* Simplified column sizes */}
                  <Link to={`/pets/${pet._id}`} className="pet-card-link">
                    <Card className="modern-pet-card h-100">
                      {" "}
                      {/* Changed card class */}
                      <div className="card-img-top-wrapper">
                        {" "}
                        {/* New wrapper for image */}
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
                        <hr className="modern-divider" />{" "}
                        {/* Changed divider class */}
                        <div className="modern-pet-info flex-grow-1">
                          {" "}
                          {/* Added flex-grow-1 */}
                          <p>
                            <strong>Tuổi:</strong>{" "}
                            {pet.birthDate
                              ? (() => {
                                  const birth = new Date(pet.birthDate);
                                  const now = new Date();

                                  let years =
                                    now.getFullYear() - birth.getFullYear();
                                  let months =
                                    now.getMonth() - birth.getMonth();
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
                          </p>
                          <p>
                            <strong>Cân nặng:</strong> {pet.weightKg} kg
                          </p>
                          <p>
                            <strong>Giới tính:</strong>{" "}
                            {pet.gender === "male"
                              ? "Đực"
                              : pet.gender === "female"
                              ? "Cái"
                              : "Không rõ"}
                          </p>
                        </div>
                        <div className="mt-auto">
                          {" "}
                          {/* Pushes button to bottom */}
                          <Link
                            to={`/pets/${pet._id}/reminders`}
                            className="btn btn-outline-info btn-sm"
                          >
                            <i className="far fa-calendar-alt me-2"></i>Lịch
                            tiêm phòng
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </section>
        {/* Care Tips Section */}
        <section className="care-tips-section mt-5 mb-5 p-4">
          {" "}
          {/* Added more padding */}
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-lightbulb me-2"></i>7 Mẹo Chăm Sóc Thú Cưng
              Hiệu Quả
            </h2>
          </div>
          <Container className="my-4">
            {" "}
            {/* Adjusted margin */}
            <Row className="justify-content-center g-3">
              {" "}
              {/* Added g-3 for gap */}
              <Col xs={12} md={6} className="mb-3">
                {" "}
                {/* Adjusted margin-bottom */}
                <img
                  src="https://sacomvet.com/upload/filemanager/benh-vien-thu-y-chuyen-nghiep-thu-duc-1.jpeg"
                  alt="Bệnh viện thú y 1"
                  className="img-fluid rounded shadow-sm" // Added shadow-sm
                  style={{ height: "300px", objectFit: "cover", width: "100%" }}
                />
              </Col>
              <Col xs={12} md={6} className="mb-3">
                {" "}
                {/* Adjusted margin-bottom */}
                <img
                  src="https://media.istockphoto.com/id/529121920/vi/anh/m%C3%A8o-ba-t%C6%B0-v%E1%BB%9Bi-b%C3%A1c-s%C4%A9-th%C3%BA-y.jpg?s=612x612&w=0&k=20&c=Xt0rbXCqwCb1Qa3vTJpLAhh_4kM1ZZYmcMn970INQ2w="
                  alt="Bệnh viện thú y 2"
                  className="img-fluid rounded shadow-sm" // Added shadow-sm
                  style={{ height: "300px", objectFit: "cover", width: "100%" }}
                />
              </Col>
            </Row>
          </Container>
          <div className="care-tips-content">
            {" "}
            {/* Removed inline whiteSpace style */}
            <p className="lead">
              {" "}
              {/* Added lead class for slightly larger text */}
              Thú cưng từ lâu đã trở thành một người bạn tâm giao, một thành
              viên quan trọng không thể thiếu trong cuộc sống bộn bề của nhiều
              người. Chính vì vậy, có rất nhiều thắc mắc xoay quanh vấn đề “phải
              chăm sóc thú cưng như thế nào để chúng luôn khỏe mạnh và ở bên ta
              thật lâu”, đặc biệt là với những người mới bắt đầu tập nuôi. Sau
              đây là 7 mẹo chăm sóc thú cưng được chuyên gia khuyên dùng:
            </p>
            <ol className="list-unstyled">
              {" "}
              {/* Changed to unstyled and added custom styling in CSS */}
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Tiêm vắc-xin đầy đủ:</strong>Bảo vệ thú cưng khỏi bệnh
                truyền nhiễm nguy hiểm như dại, care, viêm gan,...
              </li>
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Kiểm tra sức khỏe định kỳ:</strong> Giúp phát hiện sớm
                bệnh và điều trị kịp thời.
              </li>
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Chế độ dinh dưỡng lành mạnh:</strong> Đảm bảo đủ đạm,
                béo, vitamin, khoáng chất, tránh gia vị gây kích ứng.
              </li>
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Cung cấp đủ nước:</strong> Giúp trao đổi chất và duy trì
                hoạt động cơ thể.
              </li>
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Giữ môi trường sống sạch sẽ:</strong> Ngăn ngừa nấm, ký
                sinh và tăng cường tinh thần thú cưng.
              </li>
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Vận động đầy đủ:</strong> Tăng cường thể chất, giảm
                stress và béo phì.
              </li>
              <li>
                <i className="fas fa-check-circle me-2 text-success"></i>
                <strong>Vệ sinh sạch sẽ:</strong> Tắm rửa giúp loại bỏ vi khuẩn
                và làm thú cưng thoải mái hơn.
              </li>
            </ol>
            <p className="mt-4 text-center text-muted">
              Pet ID+ hy vọng bạn sẽ áp dụng những mẹo trên để thú cưng của mình
              luôn khỏe mạnh và hạnh phúc.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
