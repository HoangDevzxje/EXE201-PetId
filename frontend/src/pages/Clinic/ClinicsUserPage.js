import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ClinicsUserPage.css';

import api from '../../api/baseApi';

const ClinicsUserPage = () => {
    const [clinics, setClinics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const res = await api.get(`/admin/clinics`);
                const activeClinics = res.data
                    .filter(clinic => clinic.isActive)
                    .map((clinic, index) => ({
                        ...clinic,
                        image: clinic.image || `https://placekitten.com/40${index + 1}/25${index + 1}` // ảnh tạm nếu không có
                    }));
                setClinics(activeClinics);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách phòng khám:", err);
            }
        };

        fetchClinics();
    }, []);

    const filteredClinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-center">Danh sách phòng khám thú cưng</h2>
            <Form className="mb-4 search-form">
                <Form.Control
                    type="text"
                    placeholder="Tìm theo tên hoặc địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>

            <Row>
  {filteredClinics.map(clinic => (
    <Col md={6} lg={4} key={clinic._id} className="mb-4">
      <Card className="h-100 shadow-sm clinic-card">
        <Card.Img
          variant="top"
          src={clinic.imageUrl || "/images/clinics/default.jpg"}
          alt={clinic.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/clinics/default.jpg";
          }}
          className="clinic-card-img"
        />
        <Card.Body>
          <Card.Title>{clinic.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{clinic.address}</Card.Subtitle>
          <Card.Text>{clinic.description}</Card.Text>
          <Card.Text><strong>SĐT:</strong> {clinic.phone}</Card.Text>
          <Link
            to="/clinics/detail"
            state={{ clinic }}
            className="btn btn-primary mt-2"
          >
            Xem chi tiết
          </Link>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

        </Container>
    );
};

export default ClinicsUserPage;
