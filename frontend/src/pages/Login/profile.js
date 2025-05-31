import React, { useEffect, useState } from "react";
import { fetchUser } from "../../services/authen";
import profileApi from "../../api/profileApi";
import orderApi from "../../api/orderApi";
import { Card, Button, Table, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAll();
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleChangePassword = async () => {
    try {
      const response = await profileApi.changePassword(oldPassword, newPassword);
      alert(response.message);
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
        {/* Cột trái: Thông tin + Lịch sử đơn hàng */}
        <Col md={8}>
          <h3 className="fw-bold">Xin chào, <span className="text-danger">{user?.name || "User"}</span>!</h3>

          <h4 className="fw-bold mt-4">📦 Lịch sử đơn hàng</h4>

          {loadingOrders ? (
            <p>Đang tải đơn hàng...</p>
          ) : orders.length === 0 ? (
            <p>Không có đơn hàng nào.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mt-3">
                <thead className="table-light">
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/orders/${order._id}`} className="text-decoration-none">
                          {order.orderCode || order._id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.product?.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>{order.totalAmount?.toLocaleString("vi-VN")}₫</td>
                      <td>
                        <span
                          className={`badge text-bg-${order.status === "paid"
                              ? "success"
                              : order.status === "cancelled"
                                ? "danger"
                                : "secondary"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Col>

        {/* Cột phải: Tài khoản + Đổi mật khẩu */}
        <Col md={4}>
          <h3 className="fw-bold">Thông tin tài khoản</h3>
          <Card className="p-3 shadow-sm">
            <h5 className="fw-bold mb-3">TÀI KHOẢN CỦA TÔI</h5>
            <p>
              <strong>Tên tài khoản:</strong> {user?.name}
            </p>
            <p>
              <i className="bi bi-phone-fill me-2"></i>
              <strong>Điện thoại:</strong> {user?.phone || "Chưa cập nhật"}
            </p>

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
    </div>
  );
};

export default Profile;
