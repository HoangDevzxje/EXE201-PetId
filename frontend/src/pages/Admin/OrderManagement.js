import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderManagement.css";
import api from "../../api/baseApi";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, {
        status,
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đơn hàng này?")) return;
    try {
      await api.delete(`/admin/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  // Function to calculate total price for an order
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const itemPrice = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + itemPrice * quantity;
    }, 0);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Đang tải đơn hàng...</p>;

  return (
    <div className="order-container">
      <h2 className="order-title">Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="no-orders">Không có đơn hàng nào.</p>
      ) : (
        <div className="table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.user?.name}</td>
                  <td>{order.user?.email}</td>
                  <td>
                    <div>
                      {order.items.map((item, itemIndex) => (
                        <div key={item._id}>
                          <strong>+</strong> {item.product?.name} -{" "}
                          {item.product?.price} x {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong>
                      {calculateTotalPrice(order.items).toLocaleString()} VNĐ
                    </strong>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="cancelled">Đã huỷ</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="delete-btn"
                    >
                      Xoá
                    </button>
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

export default OrderManagement;
