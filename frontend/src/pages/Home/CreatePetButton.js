import React from "react";
import { Link } from "react-router-dom";
import "./CreatePetButton.css"; // Import CSS

const CreatePetButton = () => {
  return (
    <div className="floating-pet-button">
      <Link to="/pets/manage" className="btn btn-primary create-pet-btn">
        <i className="fas fa-plus"></i>
        Tạo hồ sơ thú cưng
      </Link>
    </div>
  );
};

export default CreatePetButton;
