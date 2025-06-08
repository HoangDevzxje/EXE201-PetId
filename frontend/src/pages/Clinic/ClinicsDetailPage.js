import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './ClinicDetailPage.css';

import api from '../../api/baseApi';

const ClinicDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [clinic, setClinic] = useState(location.state?.clinic || null);
  const [appointment, setAppointment] = useState({ name: '', phone: '', service: '', note: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        if (!clinic) {
          if (id) {
            const res = await api.get(`/admin/clinics/${id}`);
            setClinic(res.data);
          } else {
            const res = await api.get(`/admin/clinics`);
            const activeClinics = res.data.filter(c => c.isActive);
            if (activeClinics.length > 0) {
              setClinic(activeClinics[0]);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy phòng khám:", err);
      }
    };

    fetchClinic();
  }, [id, clinic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/appointments`, {
        ...appointment,
        clinicId: clinic?._id
      });
      setMessage('✅ Đặt lịch thành công!');
      setAppointment({ name: '', phone: '', service: '', note: '' });
    } catch (err) {
      console.error("Lỗi khi đặt lịch:", err);
      setMessage('❌ Đặt lịch thất bại! Vui lòng thử lại.');
    }
  };

  if (!clinic) return <Container className="mt-4">Đang tải thông tin phòng khám...</Container>;

  return (
    <Container className="mt-4">
      <Card className="mb-4 shadow clinic-detail-card">
        <Card.Img
          variant="top"
          src={clinic.imageUrl || '/images/clinics/default.jpg'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/clinics/default.jpg';
          }}
          alt="Ảnh phòng khám"
          className="clinic-detail-img"
        />
        <Card.Body>
          <Card.Title as="h3">{clinic.name}</Card.Title>
          <Card.Text><strong>📍 Địa chỉ:</strong> {clinic.address}</Card.Text>
          <Card.Text><strong>📞 Số điện thoại:</strong> {clinic.phone}</Card.Text>
          <Card.Text><strong>📝 Mô tả:</strong> {clinic.description}</Card.Text>
        </Card.Body>
      </Card>

      <h4 className="mb-3">📆 Đặt lịch chăm sóc thú cưng</h4>
      {message && <Alert variant="info" className="mt-3">{message}</Alert>}

      <Card className="shadow">
        <Card.Body>
          <Form onSubmit={handleSubmit} className="appointment-form">
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={appointment.name}
                onChange={(e) => setAppointment({ ...appointment, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={appointment.phone}
                onChange={(e) => setAppointment({ ...appointment, phone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dịch vụ</Form.Label>
              <Form.Control
                type="text"
                placeholder="VD: Tắm, khám, triệt sản..."
                value={appointment.service}
                onChange={(e) => setAppointment({ ...appointment, service: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lời nhắn cho phòng khám</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={appointment.note}
                onChange={(e) => setAppointment({ ...appointment, note: e.target.value })}
              />
            </Form.Group>

            <Button type="submit">Đặt lịch</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClinicDetailPage;
