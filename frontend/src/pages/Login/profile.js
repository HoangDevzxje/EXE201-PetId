import React, { useEffect, useState } from "react";
import { fetchUser } from "../../services/authen";
import profileApi from "../../api/profileApi";
import { Card, Button, Table, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const orders = [];

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
    <div className="container mt-5">
      <Row>
        {/* Cột trái: Lịch sử đơn hàng */}
        <Col md={8}>
          <h3 className="fw-bold">Thông tin tài khoản</h3>
          <p>
            Xin chào, <span className="text-danger fw-bold">{user?.name || "User"}</span>!
          </p>
          <Table striped bordered hover responsive>
            <thead className="table-secondary text-center">
              <tr>
                <th>Đơn hàng</th>
                <th>Ngày</th>
                <th>Giá trị đơn hàng</th>
                <th>Trạng thái thanh toán</th>
                <th>Trạng thái giao hàng</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5">Không có đơn hàng nào.</td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.total}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.deliveryStatus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>

        {/* Cột phải: Thông tin tài khoản */}
        <Col md={4}>
          <h3 className="fw-bold">Thông tin tài khoản</h3>
          <p>
            Xin chào, <span className="text-danger fw-bold">{user?.name || "User"}</span>!
          </p>
          <Card className="p-3 shadow-sm">
            <h5 className="fw-bold mb-3">TÀI KHOẢN CỦA TÔI</h5>
            <p>
              <strong>Tên tài khoản:</strong> {user?.name}
            </p>
            <p>
              <i className="bi bi-phone-fill me-2"></i>
              <strong>Điện thoại:</strong> {user?.phone || "Chưa cập nhật"}
            </p>
            {/* <p>
              <i className="bi bi-geo-alt-fill me-2"></i>
              <strong>Địa chỉ:</strong> {user?.address || "Chưa cập nhật"}
            </p>
            <p>
              <i className="bi bi-airplane-fill me-2"></i>
              <strong>Quốc gia:</strong> {user?.country || "Vietnam"}
            </p> */}
            <Button
              className="w-100 mt-3 text-white border-0"
              style={{ backgroundColor: "#C49A6C" }}
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Thay đổi mật khẩu <i className="bi bi-lock ms-2"></i>
            </Button>
            {showPasswordForm && (
              <Form className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      <i className={`bi ${showOldPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="success"
                  onClick={handleChangePassword}
                  disabled={!oldPassword || !newPassword}
                >
                  Cập nhật mật khẩu
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div >
  );
};

export default Profile;
