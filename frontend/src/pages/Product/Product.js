import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Button,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import "./Product.css";
import api from "../../api/baseApi";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, featuredRes] = await Promise.all([
          api.get("/products/main"),
          api.get("/categories"),
          api.get("/products/featured"),
        ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setFeaturedProducts(featuredRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category?._id === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Container className="main-content">
        <div className="d-flex justify-content-start mb-4">
          <Link to="/" className="btn btn-secondary mb-3">
            &larr; Quay lại trang chủ
          </Link>
        </div>
        {featuredProducts.length > 0 && (
          <div className="featured-section">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Row className="featured-grid">
              {featuredProducts.map((product) => (
                <Col
                  key={product._id}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="mb-4"
                >
                  <Card className="product-card featured">
                    <Link to={`/product/${product._id}`}>
                      <div className="img-container">
                        <Card.Img
                          variant="top"
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      </div>
                    </Link>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Subtitle className="category-name">
                        {product.category?.name}
                      </Card.Subtitle>
                      <Card.Text className="price">
                        {product.price.toLocaleString()}đ
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div className="filter-section">
          <h2>Danh sách sản phẩm</h2>
          <Form.Group className="category-filter">
            <Form.Label>Lọc theo danh mục:</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Tất cả sản phẩm</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
          </div>
        ) : (
          <Row className="products-grid">
            {filteredProducts.map((product) => (
              <Col
                key={product._id}
                lg={3}
                md={4}
                sm={6}
                xs={12}
                className="mb-4"
              >
                <Card className="product-card">
                  <Link to={`/product/${product._id}`}>
                    <div className="img-container">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </div>
                  </Link>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Subtitle className="category-name">
                      {product.category?.name}
                    </Card.Subtitle>
                    <Card.Text className="price">
                      {product.price.toLocaleString()}đ
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Product;
