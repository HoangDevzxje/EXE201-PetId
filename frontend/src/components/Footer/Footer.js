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
            src="https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/499952565_1938189916923811_2585624547647457727_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFmtzrc5CehTIonJhXX5hooX5YIVwaa5Q9flghXBprlDwTJexxPD-P9meykWFfLyiY-9S2rP9pub_cJGK_U02Gu&_nc_ohc=VwmwZR4M6rMQ7kNvwFJYMzs&_nc_oc=AdkpUhhi-TZd6e2fV59lvTtocFb6Gq1D8wiMgSDzfWQu3u5lVIEJDTwsKXgKdDkjHIY&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=6rvzSVsrtwdb2VEIWRevAg&oh=00_AfLLggc-BF3IuaxBwn8apVC6GVOjLe21rjwKbJ8Wa4tpQA&oe=683D5327"
            alt="PetID+ Logo"
            className="footer-logo"
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
