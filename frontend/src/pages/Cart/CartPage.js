import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="mb-4 fw-bold">🛒 Giỏ hàng của bạn</h2>

      {cart.length === 0 ? (
        <p>
          Giỏ hàng trống. <Link to="/">Tiếp tục mua sắm</Link>
        </p>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tạm tính</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                          className="me-3 rounded"
                        />
                        <span>{item.product.name}</span>
                      </div>
                    </td>
                    <td>{item.product.price.toLocaleString("vi-VN")}₫</td>
                    <td>{item.quantity}</td>
                    <td>
                      {(item.product.price * item.quantity).toLocaleString(
                        "vi-VN"
                      )}
                      ₫
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <h4>Tổng cộng: {total.toLocaleString("vi-VN")}₫</h4>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={clearCart}
              >
                Xoá hết
              </button>
              <Link to="/checkout" className="btn btn-dark">
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
