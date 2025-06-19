import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Header.css";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();

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
            src="/PetId+.png"
            alt="Logo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
            }}
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
                    <span className="single-line" title={user?.name}>
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

            {/* Cart */}
            <li className="nav-item">
              <Link
                className="nav-link position-relative d-flex align-items-center cart-link"
                to="/cart"
              >
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
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
