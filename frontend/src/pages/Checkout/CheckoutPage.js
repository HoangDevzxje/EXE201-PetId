import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import { toast } from "react-toastify";
import { createVietQR } from "../../api/vietqrApi";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [orderCode, setOrderCode] = useState("");
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Tạo mã đơn ngẫu nhiên
  useEffect(() => {
    const randomCode = "ORD" + Math.floor(100000 + Math.random() * 900000);
    setOrderCode(randomCode);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Tạo mã QR thanh toán
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const base64 = await createVietQR({
          accountNo: "16819092003",
          accountName: "NGUYEN XUAN HOANG",
          acqId: 970422,
          amount: total,
          addInfo: `THANH TOAN ${orderCode}`,
          template: "compact2",
        });
        setQrImage(base64);
      } catch (err) {
        console.error("Lỗi tạo QR VietQR:", err);
      }
    };
    if (orderCode && total > 0) fetchQR();
  }, [orderCode, total]);

  // Tạo đơn hàng
  const handleCreateOrder = async () => {
    if (!address || !phone) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ và số điện thoại.");
      return;
    }

    try {
      const payload = {
        orderCode,
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress: address,
        contactPhone: phone,
      };

      const res = await orderApi.create(payload);
      setOrderId(res.data._id);
      setOrderCreated(true);
      toast.success("Đã tạo đơn hàng thành công");
    } catch (err) {
      toast.error("Lỗi khi tạo đơn hàng");
    }
  };

  // Xác nhận thanh toán
  const handleMarkAsPaid = async () => {
    try {
      await orderApi.updateStatus(orderId, "paid");
      toast.success("Đã xác nhận thanh toán thành công");
      clearCart();
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="mb-4 fw-bold">🧾 Xác nhận đơn hàng</h2>

      {cart.length === 0 ? (
        <p>Không có sản phẩm trong giỏ hàng.</p>
      ) : (
        <>
          <h5 className="mb-3">
            Mã đơn hàng: <span className="text-primary">{orderCode}</span>
          </h5>

          <ul className="list-group mb-4">
            {cart.map((item) => (
              <li
                key={item.product._id}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>
                  {(item.product.price * item.quantity).toLocaleString("vi-VN")}
                  ₫
                </span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Tổng cộng</span>
              <span>{total.toLocaleString("vi-VN")}₫</span>
            </li>
          </ul>

          <div className="text-center">
            <h5 className="fw-bold mb-3">💳 Quét mã để thanh toán</h5>

            {qrImage && (
              <img
                src={qrImage}
                alt="QR thanh toán"
                style={{
                  maxWidth: 280,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            )}

            <p className="mt-2 text-muted">
              Vui lòng kiểm tra nội dung chuyển khoản: <br />
              <strong>{`THANH TOAN ${orderCode}`}</strong>
            </p>

            <div
              className="mb-3 text-start"
              style={{ maxWidth: 500, margin: "0 auto" }}
            >
              <label htmlFor="address" className="form-label fw-semibold">
                📍 Địa chỉ giao hàng
              </label>
              <textarea
                id="address"
                className="form-control"
                rows={2}
                placeholder="Nhập địa chỉ nhận hàng của bạn"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div
              className="mb-4 text-start"
              style={{ maxWidth: 500, margin: "0 auto" }}
            >
              <label htmlFor="phone" className="form-label fw-semibold">
                📞 Số điện thoại liên hệ
              </label>
              <input
                id="phone"
                className="form-control"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {!orderCreated ? (
              <button className="btn btn-dark" onClick={handleCreateOrder}>
                ✅ Tạo đơn hàng
              </button>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={handleMarkAsPaid}
              >
                💰 Đã thanh toán & Cập nhật
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
