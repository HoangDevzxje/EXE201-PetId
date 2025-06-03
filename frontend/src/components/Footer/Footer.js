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
            src="https://scontent.fhan14-5.fna.fbcdn.net/v/t1.15752-9/480464299_1159822715802794_7333872149066597135_n.png?_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeG0lj74EskpN4oqK0wHo3LGEwiXKu05PDMTCJcq7Tk8M4zBCsBZpalW9fLMUyICq0N-5QbN7alUPZ47UQReorvE&_nc_ohc=NZCTn08pCa8Q7kNvwEpD1rk&_nc_oc=Adn3CtljCePd2XNisFEcTuXzhO-ELXMhrCRUN2LMp5I4hgZhCLOaVprpG4Ar-H9kAm4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&oh=03_Q7cD2QFGLbkZQ3LnOx1V7ze2WwRVnuwYfoOVbNJYCdWdl0najw&oe=684CB9BC"
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
