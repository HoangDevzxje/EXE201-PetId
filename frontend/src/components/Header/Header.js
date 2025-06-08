import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../services/useCartStore"; // 👈 Thêm dòng này
=======
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
>>>>>>> backup-code-8-6
import "./Header.css";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();
  const { cartItems } = useCartStore(); // 👈 Lấy cart từ store
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0); // 👈 Tính tổng số lượng

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?name=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm petid-navbar"
      style={{ backgroundColor: "#c49a6c" }}
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
          <span className="brand-name single-line">PetID+</span>
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
          {/* Search bar */}
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
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/product">
                Sản phẩm thú cưng
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/clinics">
                Đặt lịch khám
              </Link>
            </li>

            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/register">
                    Đăng ký
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/login">
                    Đăng nhập
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Dropdown user menu */}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserCircle size={22} />
                    <span
                      className="single-line"
                      title={user?.name}
                    >
                      {user?.name || "Tài khoản"}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/me">
                        Thông tin người dùng
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}

<<<<<<< HEAD
            {/* Cart icon + số lượng */}
            <li className="nav-item position-relative">
=======
            {/* Cart */}
            <li className="nav-item">
>>>>>>> backup-code-8-6
              <Link
                className="nav-link d-flex align-items-center cart-link"
                to="/cart"
              >
<<<<<<< HEAD
                <FaShoppingCart size={20} />
                <span className="ms-1 fw-semibold">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
=======
                <div className="position-relative">
                  <FaShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="ms-1 fw-semibold single-line">Giỏ hàng</span>
>>>>>>> backup-code-8-6
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
