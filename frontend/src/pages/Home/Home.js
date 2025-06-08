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
      url: "/image.png",
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
      // link: "/pets",
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
      link: "/clinics",
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
      {/* Benefit Section */}
      <section className="benefit-section">
        <Container>
          <div className="section-header">
            <h3>
              Những Lợi Ích Khi Có Pet ID+ Trong Tay – Nuôi Boss Mượt Như Lan,
              Chẳng Ngại Gian Nan
            </h3>
          </div>
          <div className="benefit-content">
            <ul>
              <li>
                <strong>Hồ sơ gọn, boss không dỗi, sen không rối</strong>
                <br />
                Từ tên gọi tới món khoái khẩu, từ giống loài tới biểu cảm "kêu
                là tới" – Pet ID+ gom hết vào 1 chỗ, xịn xò hơn sổ hồng!
                <br />
                Không còn cảnh “đào mộ” giấy tờ cũ rích – chỉ cần click là thấy
                ngay lịch sử “bệnh tình và tình cảm” của boss!
              </li>
              <li>
                <strong>Nhắc lịch cực tỉnh – Tiêm đúng cực đỉnh</strong>
                <br />
                "Meow meow, tới giờ đi chích ngừa rồi nha sen~"
                <br />
                Hệ thống nhắc lịch auto đỉnh chóp – tiêm phòng, tẩy giun,
                check-up định kỳ, chẳng bỏ sót giây nào!
              </li>
              <li>
                <strong>Boss bầy đàn, sen vẫn nhàn</strong>
                <br />
                Một nhà full "team chó team mèo", Pet ID+ vẫn lo hết!
                <br />
                Bạn có thể quản lý nguyên vũ trụ thú cưng trên cùng một website
                – từ bé Poodle bánh bèo tới hoàng thượng Maine Coon cool ngầu
                <br />
                Một website, nhiều boss, không tốn một giọt mồ hôi – chỉ tốn
                thêm tình yêu thôi nha
              </li>
            </ul>
            <div className="benefit-cta">
              <p>
                <strong> Pet ID+ – Chăm Boss Đúng Chất Gen Z!</strong>
                <br />
                Boss khỏe – Sen nhàn – Cuộc sống mượt mà như lông mèo mới chải!
                <br />
                <span role="img" aria-label="arrow">
                  👉
                </span>{" "}
                Sử dụng ngay Pet ID+ – Đừng để boss giận vì sen “não cá vàng”
              </p>
            </div>
          </div>
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
