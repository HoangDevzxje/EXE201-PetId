import React, { useState } from "react";
import { useCartStore } from "../../services/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Checkout.css";
import axios from "axios";

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setShowModal(true);
  };

//   const handleConfirmPayment = () => {
//     alert("Đơn hàng đã được ghi nhận. Cảm ơn bạn!");
//     clearCart();
//     setShowModal(false);
//     navigate("/");
//   };
const handleConfirmPayment = async () => {
  try {
    const orderData = {
      customer: form,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
    };

    const res = await axios.post("http://localhost:9999/orders/create", orderData);

    if (res.data.success) {
      alert("Đơn hàng đã được lưu. Cảm ơn bạn!");
      clearCart();
      setShowModal(false);
      navigate("/");
    } else {
      alert("Có lỗi khi lưu đơn hàng.");
    }
  } catch (err) {
    console.error(err);
    alert("Không thể lưu đơn hàng.");
  }
};


  return (
    <div className="checkout container py-5">
      <h2 className="mb-4">Thanh toán</h2>
      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-5 rounded shadow-sm">
          <p className="text-muted mb-3">Giỏ hàng của bạn đang trống.</p>
          <Link to="/" className="btn btn-dark">Quay lại mua sắm</Link>
        </div>
      ) : (
        <div className="row">
          {/* Form thông tin giao hàng */}
          <div className="col-md-6 mb-4">
            <div className="p-4 bg-white shadow-sm rounded">
              <h5 className="mb-3 fw-semibold">Thông tin giao hàng</h5>
              <input
                className="form-control mb-3"
                name="name"
                placeholder="Họ tên"
                value={form.name}
                onChange={handleChange}
              />
              <input
                className="form-control mb-3"
                name="phone"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
              />
              <textarea
                className="form-control"
                name="address"
                rows="3"
                placeholder="Địa chỉ giao hàng"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="col-md-6">
            <div className="p-4 bg-white shadow-sm rounded">
              <h5 className="mb-3 fw-semibold">Đơn hàng của bạn</h5>
              <ul className="list-group mb-3">
                {cartItems.map((item) => (
                  <li
                    key={item.cartItemId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-danger">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </li>
                ))}
              </ul>
              <div className="text-end">
                <h5 className="fw-bold">
                  Tổng cộng:{" "}
                  <span className="text-danger">
                    {total.toLocaleString("vi-VN")}₫
                  </span>
                </h5>
                <button className="btn btn-dark w-100 mt-3" onClick={handlePayment}>
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR thanh toán */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quét mã QR để thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src="/qrcode.jpg"
            alt="QR code thanh toán"
            style={{ width: "100%", maxWidth: 300 }}
          />
          <p className="mt-3 text-muted">Vui lòng quét mã bằng app ngân hàng / ví điện tử</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleConfirmPayment}>
            Tôi đã thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Checkout;
