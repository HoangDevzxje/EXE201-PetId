import React from "react";
import { Link } from "react-router-dom";
import "./PetListButton.css";

const PetListButton = () => {
  return (
    <div className="floating-pet-list-button">
      <Link to="/pets" className="btn btn-success pet-list-btn">
        <i className="fas fa-list"></i>
        Thú cưng của tôi
      </Link>
    </div>
  );
};

export default PetListButton;
