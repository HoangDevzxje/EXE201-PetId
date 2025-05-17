import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?name=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm petid-navbar"
      style={{ backgroundColor: "#C49A6C" }}
    >
      <div className="container">
        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center brand-container"
          to="/"
        >
          <img
            src="https://scontent.fhan14-5.fna.fbcdn.net/v/t1.15752-9/480464299_1159822715802794_7333872149066597135_n.png?_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeG0lj74EskpN4oqK0wHo3LGEwiXKu05PDMTCJcq7Tk8M4zBCsBZpalW9fLMUyICq0N-5QbN7alUPZ47UQReorvE&_nc_ohc=NZCTn08pCa8Q7kNvwEpD1rk&_nc_oc=Adn3CtljCePd2XNisFEcTuXzhO-ELXMhrCRUN2LMp5I4hgZhCLOaVprpG4Ar-H9kAm4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&oh=03_Q7cD2QFGLbkZQ3LnOx1V7ze2WwRVnuwYfoOVbNJYCdWdl0najw&oe=684CB9BC"
            alt="Logo"
            className="brand-logo"
          />
          <span className="brand-name">PetID+</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Search bar - now in a centered container */}
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn search-button" type="submit">
                  <FaSearch size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation links */}
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Đăng ký */}
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/register">
                Đăng ký
              </Link>
            </li>
            {/* Đăng nhập */}
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/login">
                Đăng nhập
              </Link>
            </li>
            {/* Giỏ hàng */}
            <li className="nav-item">
              <Link
                className="nav-link position-relative d-flex align-items-center cart-link"
                to="/cart"
              >
                <FaShoppingCart size={20} />
                <span className="ms-1 fw-semibold">Giỏ hàng</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
