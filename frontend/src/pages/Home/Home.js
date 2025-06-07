import React, { useEffect, useState } from "react";
import api from "../../api/baseApi";
import { useAuth } from "../../context/AuthContext";
import { Row, Col, Container } from "react-bootstrap";
import {
  FaPaw,
  FaCalendarAlt,
  FaClinicMedical,
  FaHeart,
  FaBoxOpen,
} from "react-icons/fa";
import { GiHealthNormal, GiDogBowl } from "react-icons/gi";
import { MdPets, MdHealthAndSafety } from "react-icons/md";
import "./Home.css";
import { AiFillShopping } from "react-icons/ai";
const Home = () => {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const { token, loading } = useAuth();

  const bannerImages = [
    {
      url: "https://w0.peakpx.com/wallpaper/548/196/HD-wallpaper-cat-kitten-dog-animal-puppy-cute-cat-dog.jpg",
      alt: "Happy golden retriever at spa",
      title: "🐾 Chào mừng bạn đến với PetID+",

      features: [
        "Boss vui khỏe – Sen nhàn tênh!",
        "Hồ sơ gọn nhẹ, lịch hẹn thông minh,",
        "Chăm boss chuẩn chỉnh, chẳng lo linh tinh!",
      ],
      cta: "Tới PetID+ ngay",
    },
    {
      url: "https://t3.ftcdn.net/jpg/01/81/80/08/360_F_181800836_YpivA1slyuHxKTNjg6JPtxfta9FPHo5f.jpg",
      alt: "Professional pet grooming",
      title: "🐾 Chăm từ móng đến… ngoáy tai!",

      features: [
        "Dịch vụ chăm sóc thú cưng xịn xò – vì boss xứng đáng được chiều!",
        "Bạn bận? Để tụi mình lo!",
        "Tắm rửa, spa, massage, cắt móng – boss bước ra là thơm tho lấp lánh như idol K-pop.",
      ],
      cta: "Tới PetID+ ngay",
    },
    {
      url: "https://scontent.fhan14-2.fna.fbcdn.net/v/t1.15752-9/494824802_9801386069980181_3984430373227015678_n.png?stp=dst-png_s480x480&_nc_cat=100&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeE1ztc2aDm1uys8UzbH2_QSjKqxZbP604KMqrFls_rTguUyhK9whmbB4G1jUSecjOqTb6oNo4xKXnaDpgs2tQPc&_nc_ohc=nIg9Dbn78LEQ7kNvwGxg1yx&_nc_oc=Adk2RO-pYm0hEEb8-DcLJ0EMmHGsgAml9lNrQSzrUhYGxgPeVaGj5iJ5YMfvyCi9DiY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&oh=03_Q7cD2gHp0Tz-zQjubA0qNy9mYOSHhyMvByRmaJA8s_k9Cm729g&oe=686B3E16",
      alt: "Dog with fashionable accessories",
      title: "Phụ kiện cao cấp cho boss",
      subtitle: `“Sen” mua đồ – “Boss” không chê 😎
Phụ kiện trendy – từ bé cưng đến “cục nợ” đều hợp!
`,
      features: [
        "🦴 Vòng cổ xịn – boss đeo vào quay đầu 7749 lần",
        "🧸 Đồ chơi mới – gặm phát là quên đường về",
        "🛏️ Giường êm – boss nằm mà “sen” cũng thèm",
      ],
      cta: "Tới PetID+ ngay",
    },
  ];

  const features = [
    {
      icon: <FaPaw className="feature-icon" />,
      title: "Hồ sơ điện tử",
      description: "Lưu trữ mọi thông tin về thú cưng một cách khoa học",
      link: "/pets",
    },
    {
      icon: <FaCalendarAlt className="feature-icon" />,
      title: "Nhắc lịch thông minh",
      description: "Tự động nhắc lịch tiêm phòng, khám sức khỏe định kỳ",
    },
    {
      icon: <AiFillShopping className="feature-icon" />,
      title: "Mua sắm tiện lợi",
      description:
        "Dễ dàng tìm kiếm và mua sản phẩm phù hợp chỉ với vài thao tác",
      link: "/product",
    },
    {
      icon: <FaClinicMedical className="feature-icon" />,
      title: "Kết nối bác sĩ",
      description: "Tư vấn trực tuyến với bác sĩ thú y",
      link: "/doctor-connect",
    },
  ];

  useEffect(() => {
    if (loading) return;
    const fetchPets = async () => {
      try {
        const res = await api.get("https://localhost:9999/pets");
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
    <div className="home-container">
      {/* Hero Carousel */}
      <section className="hero-section">
        <div className="section-header">
          <h2>Chào mừng bạn đến với PetID+</h2>
        </div>
        <div className="banner-row">
          {bannerImages.map((slide, index) => (
            <div className="banner-card" key={index}>
              <div
                className="banner-image"
                style={{ backgroundImage: `url(${slide.url})` }}
                aria-label={slide.alt}
              />
              <div className="banner-content">
                <h1>{slide.title}</h1>
                <div className="feature-list">
                  {slide.features.map((feature, i) => (
                    <div key={i} className="feature-item">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="section-header">
            <h2>Giải pháp toàn diện cho thú cưng của bạn</h2>
            <p>PetID+ mang đến trải nghiệm chăm sóc thú cưng thời 4.0</p>
          </div>
          <Row className="g-3">
            {features.map((feature, index) => (
              <Col md={3} sm={6} key={index}>
                <a href={feature.link} style={{ textDecoration: "none" }}>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Pet Health Tips */}
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
            Thú cưng từ lâu đã trở thành một người bạn tâm giao, một thành viên
            quan trọng không thể thiếu trong cuộc sống bộn bề của nhiều người.
            Chính vì vậy, có rất nhiều thắc mắc xoay quanh vấn đề “phải chăm sóc
            thú cưng như thế nào để chúng luôn khỏe mạnh và ở bên ta thật lâu”,
            đặc biệt là với những người mới bắt đầu tập nuôi. Sau đây là 7 mẹo
            chăm sóc thú cưng được chuyên gia khuyên dùng:
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
              <strong>Chế độ dinh dưỡng lành mạnh:</strong> Đảm bảo đủ đạm, béo,
              vitamin, khoáng chất, tránh gia vị gây kích ứng.
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
              <strong>Vận động đầy đủ:</strong> Tăng cường thể chất, giảm stress
              và béo phì.
            </li>
            <li>
              <i className="fas fa-check-circle me-2 text-success"></i>
              <strong>Vệ sinh sạch sẽ:</strong> Tắm rửa giúp loại bỏ vi khuẩn và
              làm thú cưng thoải mái hơn.
            </li>
          </ol>
          <p className="mt-4 text-center text-muted">
            Pet ID+ hy vọng bạn sẽ áp dụng những mẹo trên để thú cưng của mình
            luôn khỏe mạnh và hạnh phúc.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
