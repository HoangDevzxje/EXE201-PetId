import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p> Địa chỉ: Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, huyện Thạch Thất, Hà Nội.</p>
          <p> Hotline: 1900 123 456</p>
          <p> Email: support@cinema.vn</p>
        </div>

        <div className="footer-section">
          <h4>Theo dõi chúng tôi</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Chính sách</h4>
          <ul>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Hỗ trợ khách hàng</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Cinema. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
