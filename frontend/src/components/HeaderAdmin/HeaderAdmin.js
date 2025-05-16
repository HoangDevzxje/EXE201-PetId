import React, { useState } from "react";
import "./HeaderAdmin.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function HeaderAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark d-flex justify-content-between position-relative">
      <div className="d-flex align-items-center">
        <a className="navbar-brand ps-3 text-white" href="index.html">
          Admin Panel
        </a>
        <button
          className="btn btn-link btn-sm me-3"
          id="sidebarToggle"
          href="#!"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <ul className="navbar-nav ms-auto">
        <li className="nav-item dropdown position-relative">
          <button
            className="nav-link dropdown-toggle btn"
            onClick={toggleDropdown}
          >
            <i className="fas fa-user"></i>
          </button>
          {isOpen && (
            <ul className="dropdown-menu dropdown-menu-end show position-absolute">
              <li></li>
              <li></li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={logout}>
                  LOGOUT
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
