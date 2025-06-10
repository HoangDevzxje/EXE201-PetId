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
import { Link } from "react-router-dom";

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const { token, loading } = useAuth();

  // Thêm state cho blog
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

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
        "Vòng cổ xịn – boss đeo vào quay đầu 7749 lần",
        "Đồ chơi mới – gặm phát là quên đường về",
        "Giường êm – boss nằm mà “sen” cũng thèm",
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

  // Fetch blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        setBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="home-container">
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
              <p style={{ margin: 0, lineHeight: 1.4 }}>
                <strong>Pet ID+ – Chăm Boss Đúng Chất Gen Z!</strong>
                <br />
                Boss khỏe – Sen nhàn – Cuộc sống mượt mà như lông mèo mới chải!
                <br />
                <span role="img" aria-label="arrow">
                  👉
                </span>{" "}
                Tạo hồ sơ cho thú cưng của bạn tại PetID+ ngay!
                <br />
                <Link
                  to="/pets/manage"
                  className="btn btn-primary create-pet-btn"
                  style={{
                    marginTop: 6,
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontWeight: 400,
                    lineHeight: 1.3,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-plus"
                    style={{ fontSize: "0.65rem", marginRight: 3 }}
                  ></i>
                  Tạo hồ sơ thú cưng
                </Link>
              </p>
            </div>
          </div>
        </Container>
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

      {/* Pet Health Tips */}
      <section className="care-tips-section mt-5 mb-5 p-4">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-lightbulb me-2"></i>7 Mẹo Chăm Sóc Thú Cưng
            Hiệu Quả
          </h2>
        </div>
        <Container className="my-4">
          <Row className="justify-content-center g-3">
            <Col xs={12} md={6} className="mb-3">
              <img
                src="https://sacomvet.com/upload/filemanager/benh-vien-thu-y-chuyen-nghiep-thu-duc-1.jpeg"
                alt="Bệnh viện thú y 1"
                className="img-fluid rounded shadow-sm"
                style={{ height: "300px", objectFit: "cover", width: "100%" }}
              />
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <img
                src="https://media.istockphoto.com/id/529121920/vi/anh/m%C3%A8o-ba-t%C6%B0-v%E1%BB%9Bi-b%C3%A1c-s%C4%A9-th%C3%BA-y.jpg?s=612x612&w=0&k=20&c=Xt0rbXCqwCb1Qa3vTJpLAhh_4kM1ZZYmcMn970INQ2w="
                alt="Bệnh viện thú y 2"
                className="img-fluid rounded shadow-sm"
                style={{ height: "300px", objectFit: "cover", width: "100%" }}
              />
            </Col>
          </Row>
        </Container>
        <div className="care-tips-content">
          <p className="lead">
            Thú cưng từ lâu đã trở thành một người bạn tâm giao, một thành viên
            quan trọng không thể thiếu trong cuộc sống bộn bề của nhiều người.
            Chính vì vậy, có rất nhiều thắc mắc xoay quanh vấn đề “phải chăm sóc
            thú cưng như thế nào để chúng luôn khỏe mạnh và ở bên ta thật lâu”,
            đặc biệt là với những người mới bắt đầu tập nuôi. Sau đây là 7 mẹo
            chăm sóc thú cưng được chuyên gia khuyên dùng:
          </p>
          <ol className="list-unstyled">
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

      {/* Blog Section */}
      <section className="blog-section mt-5 mb-5">
        <Container>
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-blog me-2"></i> Góc Blog - Chia Sẻ Kiến Thức
            </h2>
          </div>
          {loadingBlogs ? (
            <div className="text-center py-4">Đang tải blog...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Chưa có bài viết nào.
            </div>
          ) : (
            <Row className="g-4">
              {blogs.map((blog) => (
                <Col md={4} key={blog._id}>
                  <Link
                    to={`/blogs/${blog._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="blog-card h-100 shadow-sm rounded"
                      style={{ cursor: "pointer" }}
                    >
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="blog-img-top"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "8px 8px 0 0",
                          }}
                        />
                      )}
                      <div className="p-3">
                        <h5 className="blog-title">{blog.title}</h5>
                        <p
                          className="blog-desc text-muted"
                          style={{ minHeight: 60 }}
                        >
                          {blog.summary}
                          <span style={{ color: "#007bff", fontWeight: 500 }}>
                            {" "}
                            ...xem thêm
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Home;
