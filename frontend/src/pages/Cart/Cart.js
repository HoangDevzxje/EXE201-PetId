import React from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import { useCartStore } from "../../services/useCartStore";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-5 cart-container">
      <h2 className="cart-title mb-4">🛒 Giỏ hàng</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart bg-white text-center p-5 rounded shadow-sm">
          <p className="text-muted mb-3">Không có sản phẩm trong giỏ hàng.</p>
          <Link to="/" className="btn btn-dark">
            Quay lại mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-table-wrapper bg-white p-4 rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cartItemId}>
                  <td className="product-info">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-img"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td>{item.price.toLocaleString("vi-VN")}₫</td>
                  <td>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.cartItemId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => {
                          const val = Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          );
                          updateQuantity(item.cartItemId, val);
                        }}
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item.cartItemId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary text-end mt-4">
            <h4>
              Tổng cộng:{" "}
              <span className="text-danger">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </h4>
            <Link to="/checkout" className="btn btn-dark mt-3 px-4 py-2">
              Tiến hành thanh toán
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
