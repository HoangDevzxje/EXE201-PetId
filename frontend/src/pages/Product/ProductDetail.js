import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useCartStore } from "../../services/useCartStore";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9999/products/detail/${productId}`
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 py-5">
          <div className="container text-center">
            <h2 className="text-danger">Không tìm thấy sản phẩm</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="row g-4">
            {/* Left: Image */}
            <div className="col-md-5">
              <div className="bg-white rounded shadow-sm p-4 mb-3 text-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="img-fluid"
                  style={{ maxHeight: 320, objectFit: "contain" }}
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="col-md-7">
              <div className="bg-white rounded shadow-sm p-4 h-100">
                <h5 className="mb-2 text-secondary">
                  {product.category?.name}
                </h5>
                <h2 className="fw-bold mb-3">{product.name}</h2>
                <h3 className="text-danger fw-bold mb-3">
                  {product.price?.toLocaleString("vi-VN")}₫
                </h3>
                <div className="mb-3">
                  <span className="me-2">Tình trạng kho:</span>
                  <span
                    className={
                      product.stock > 0 ? "text-success" : "text-danger"
                    }
                  >
                    {product.stock > 0
                      ? `Còn ${product.stock} sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>

                {/* Quantity selector */}
                <div className="d-flex align-items-center mb-4">
                  <span className="me-2">Số lượng:</span>
                  <button
                    className="btn btn-outline-secondary px-2 py-1"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control mx-2 text-center"
                    style={{ width: 60 }}
                    value={quantity}
                    min={1}
                    max={product.stock}
                    onChange={(e) => {
                      let val = parseInt(e.target.value, 10);
                      if (isNaN(val)) val = 1;
                      if (val < 1) val = 1;
                      if (val > product.stock) val = product.stock;
                      setQuantity(val);
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary px-2 py-1"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                {/* <button className="btn btn-dark btn-lg w-100 fw-semibold mb-2">
                  Thêm vào giỏ hàng
                </button> */}
                <button
                  className="btn btn-dark btn-lg w-100 fw-semibold mb-2"
                  onClick={() => {
                    addToCart(product, quantity);
                    alert("Đã thêm vào giỏ hàng!");
                  }}
                  disabled={product.stock === 0}
                >
                  Thêm vào giỏ hàng
                </button>


              </div>
            </div>
          </div>

          {/* Description */}
          <div className="row mt-5">
            <div className="col-lg-12 mx-auto">
              <div className="bg-white rounded shadow-sm p-4">
                <h4 className="fw-bold mb-3">Mô tả sản phẩm</h4>
                <p className="mb-0">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
