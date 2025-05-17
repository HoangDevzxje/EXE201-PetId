import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(useLocation().search);
  const name = query.get("name");

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    axios
      .get(
        `http://localhost:9999/products/search?name=${encodeURIComponent(name)}`
      )
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Lỗi tìm kiếm sản phẩm:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <div className="container py-5">Đang tìm kiếm...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        Kết quả tìm kiếm cho: "<span className="text-primary">{name}</span>"
      </h3>
      <div className="row">
        {products.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào.</p>
        ) : (
          products.map((p) => (
            <div className="col-md-3 mb-3" key={p._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={p.imageUrl}
                  className="card-img-top"
                  alt={p.name}
                  style={{ objectFit: "cover", height: 200 }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-danger fw-semibold">
                    {p.price?.toLocaleString("vi-VN")}₫
                  </p>
                  <a
                    href={`/product/${p._id}`}
                    className="btn btn-outline-dark mt-auto"
                  >
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
