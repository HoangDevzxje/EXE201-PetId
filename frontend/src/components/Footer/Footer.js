import React from "react";
import "./Footer.css";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phần logo sử dụng link ảnh */}
        <div className="footer-section logo-section">
          <img
            src="/PetId+.png"
            alt="Logo"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
          />
          <p>PetID+ Nơi chăm sóc thú cưng của bạn tốt hơn</p>
        </div>

        <div className="footer-section">
          <h4>Thông tin liên hệ</h4>
          <p>chiennxhe176221@fpt.edu.vn</p>
          <p>0836663285</p>
          <p>Ha Noi - Viet Nam</p>
        </div>

        <div className="footer-section">
          <h4>Page PetID+ giúp bạn hiểu thêm về thú cưng của bạn</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/profile.php?id=61576388223451">
              <FaFacebookF />
              <span style={{ marginLeft: "5px" }}>Theo dõi Page PetID+</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
