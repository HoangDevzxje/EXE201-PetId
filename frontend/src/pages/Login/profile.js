import React, { useEffect, useState } from "react";
import { fetchUser } from "../../services/authen";
import profileApi from "../../api/profileApi";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUser();
      if (!userData) {
        navigate("/login");
      } else {
        setUser(userData);
      }
    };
    getUser();
  }, [navigate]);

  const handleChangePassword = async () => {
    try {
      const response = await profileApi.changePassword(oldPassword, newPassword);
      alert(response.message); // Hiển thị thông báo thành công
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      alert("Lỗi khi đổi mật khẩu: " + (error.response?.data?.message || "Vui lòng thử lại!"));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 rounded-4 border-0" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body className="text-center">
          <i className="bi bi-person-circle text-primary mb-3" style={{ fontSize: "100px" }}></i>
          <Card.Title className="fw-bold fs-4">Thông Tin Cá Nhân</Card.Title>
          <Card.Text className="text-muted"><strong>Name:</strong> {user?.name}</Card.Text>
          <Card.Text className="text-muted"><strong>Email:</strong> {user?.email}</Card.Text>
          <Card.Text className="text-muted"><strong>Phone:</strong> {user?.phone}</Card.Text>

          {!showPasswordForm ? (
            <Button variant="primary" className="mt-3 w-100" onClick={() => setShowPasswordForm(true)}>
              Thay đổi mật khẩu
            </Button>
          ) : (
            <Form className="mt-3">
              {/* Mật khẩu cũ */}
              <Form.Group className="mb-2">
                <Form.Label>Mật khẩu cũ</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu cũ"
                  />
                  <InputGroup.Text onClick={() => setShowOldPassword(!showOldPassword)} style={{ cursor: "pointer" }}>
                    <i className={`bi ${showOldPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* Mật khẩu mới */}
              <Form.Group className="mb-2">
                <Form.Label>Mật khẩu mới</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <InputGroup.Text onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: "pointer" }}>
                    <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="success" onClick={handleChangePassword} className="w-100">
                  Xác nhận
                </Button>
                <Button variant="secondary" onClick={() => setShowPasswordForm(false)} className="w-100">
                  Hủy
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
