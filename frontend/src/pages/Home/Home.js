import React, { useEffect, useState } from "react";
import api from "../../api/baseApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Carousel, Container } from "react-bootstrap";
import "./Home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [pets, setPets] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { token, loading } = useAuth();

  // Banner images data
  const bannerImages = [
    {
      url: "https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-golden-retriever-and-a-cat-greeting-each-other-image_2891837.jpg",
      alt: "Golden retriever and cat",
      title: "Chào mừng đến với PetID+",
      subtitle: "Nơi hỗ trợ sức khỏe cho thú cưng của bạn",
    },
    {
      url: "https://static.tuoitre.vn/tto/i/s626/2015/09/03/cho-meo-0-1441255567.jpg",
      alt: "Dog and cat together",
      title: "Chăm sóc toàn diện",
      subtitle: "Dịch vụ chăm sóc thú cưng chất lượng cao",
    },
    {
      url: "https://truongthinh.info/wp-content/uploads/2021/09/22/03/anh-cho-va-meo-cute-de-thuong-anh-che-cho-meo-hai-huoc-nhat-14.jpg",
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
                <div className="hero-overlay" />
                <div className="hero-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* My Pets Section */}
      <section className="pets-section container mt-5">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-paw me-2"></i>Thú cưng của tôi
          </h2>
          <Link to="/pets/manage" className="btn btn-outline-secondary">
            Tạo hồ sơ thú cưng
          </Link>
        </div>

        {loadingPets ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="secondary" />
          </div>
        ) : pets.length === 0 ? (
          <div className="empty-state">
            <p>
              Hãy đăng nhập để xem thông tin hoặc tạo hồ sơ cho thú cưng của
              bạn!
            </p>
            <Link to="/login" className="btn btn-primary">
              Thú cưng
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {pets.slice(0, 3).map((pet) => (
              <Col key={pet._id} xs={12} sm={6} md={4} lg={4}>
                <Link to={`/pets/${pet._id}`} className="pet-card-link">
                  <div className="styled-pet-card">
                    <div className="styled-pet-avatar">
                      <img
                        src={pet.avatarUrl || "/images/default-pet.png"}
                        alt={pet.name}
                        onError={(e) => {
                          e.target.src = "/images/default-pet.png";
                        }}
                      />
                    </div>
                    <div className="styled-pet-content">
                      <h5 className="styled-pet-name">
                        {pet.name || "Chưa đặt tên"}
                      </h5>
                      <hr className="divider" />
                      <div className="styled-pet-info">
                        <p>
                          <strong>Tuổi:</strong>{" "}
                          {pet.birthDate
                            ? (() => {
                                const birth = new Date(pet.birthDate);
                                const now = new Date();

                                let years =
                                  now.getFullYear() - birth.getFullYear();
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
                        <Link
                          to={`/pets/${pet._id}/reminders`}
                          className="btn btn-sm btn-outline-primary mt-2"
                        >
                          📅 Lịch tiêm phòng
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </section>
      <section className="care-tips-section container mt-5 mb-5">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-paw me-2"></i>7 Mẹo Chăm Sóc Thú Cưng Hiệu Quả
          </h2>
        </div>
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={6} className="mb-4">
              <img
                src="https://sacomvet.com/upload/filemanager/benh-vien-thu-y-chuyen-nghiep-thu-duc-1.jpeg"
                alt="Bệnh viện thú y 1"
                className="img-fluid rounded shadow"
                style={{ height: "300px", objectFit: "cover", width: "100%" }}
              />
            </Col>
            <Col xs={12} md={6} lg={6} className="mb-4">
              <img
                src="https://media.istockphoto.com/id/529121920/vi/anh/m%C3%A8o-ba-t%C6%B0-v%E1%BB%9Bi-b%C3%A1c-s%C4%A9-th%C3%BA-y.jpg?s=612x612&w=0&k=20&c=Xt0rbXCqwCb1Qa3vTJpLAhh_4kM1ZZYmcMn970INQ2w="
                alt="Bệnh viện thú y 2"
                className="img-fluid rounded shadow"
                style={{ height: "300px", objectFit: "cover", width: "100%" }}
              />
            </Col>
          </Row>
        </Container>
        <div className="care-tips-content" style={{ whiteSpace: "pre-line" }}>
          <p>
            Thú cưng từ lâu đã trở thành một người bạn tâm giao, một thành viên
            quan trọng không thể thiếu trong cuộc sống bộn bề của nhiều người.
            Chính vì vậy, có rất nhiều thắc mắc xoay quanh vấn đề “phải chăm sóc
            thú cưng như thế nào để chúng luôn khỏe mạnh và ở bên ta thật lâu”,
            đặc biệt là với những người mới bắt đầu tập nuôi. Sau đây là 7 mẹo
            chăm sóc thú cưng được chuyên gia khuyên dùng:
          </p>
          <ol>
            <li>
              <strong>Tiêm vắc-xin đầy đủ:</strong> Bảo vệ thú cưng khỏi bệnh
              truyền nhiễm nguy hiểm như dại, care, viêm gan,...
            </li>
            <li>
              <strong>Kiểm tra sức khỏe định kỳ:</strong> Giúp phát hiện sớm
              bệnh và điều trị kịp thời.
            </li>
            <li>
              <strong>Chế độ dinh dưỡng lành mạnh:</strong> Đảm bảo đủ đạm, béo,
              vitamin, khoáng chất, tránh gia vị gây kích ứng.
            </li>
            <li>
              <strong>Cung cấp đủ nước:</strong> Giúp trao đổi chất và duy trì
              hoạt động cơ thể.
            </li>
            <li>
              <strong>Giữ môi trường sống sạch sẽ:</strong> Ngăn ngừa nấm, ký
              sinh và tăng cường tinh thần thú cưng.
            </li>
            <li>
              <strong>Vận động đầy đủ:</strong> Tăng cường thể chất, giảm stress
              và béo phì.
            </li>
            <li>
              <strong>Vệ sinh sạch sẽ:</strong> Tắm rửa giúp loại bỏ vi khuẩn và
              làm thú cưng thoải mái hơn.
            </li>
          </ol>
          <p>
            Pet ID+ hy vọng bạn sẽ áp dụng những mẹo trên để thú cưng của mình
            luôn khỏe mạnh và hạnh phúc.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
