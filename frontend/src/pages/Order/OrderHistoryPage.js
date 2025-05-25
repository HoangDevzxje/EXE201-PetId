import { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import { Link } from "react-router-dom";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAll();
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4">📦 Lịch sử đơn hàng</h2>

      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
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
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-decoration-none"
                    >
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
                      className={`badge text-bg-${
                        order.status === "paid"
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
    </div>
  );
}
