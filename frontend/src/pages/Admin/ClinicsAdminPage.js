import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';
import { Switch, Snackbar, Alert } from '@mui/material';

const API_BASE_URL = 'http://localhost:9999';

const ClinicsAdminPage = () => {
    const [clinics, setClinics] = useState([]);
    const [showBox, setShowBox] = useState(false);
    const [currentClinic, setCurrentClinic] = useState({ name: '', address: '', phone: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchClinics = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/clinics`);
            setClinics(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách phòng khám:", err);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    const openBox = (clinic = { name: '', address: '', phone: '', description: '' }) => {
        setCurrentClinic(clinic);
        setIsEditing(!!clinic._id);
        setShowBox(true);
    };

    const closeBox = () => {
        setShowBox(false);
        setCurrentClinic({ name: '', address: '', phone: '', description: '' });
    };

    const saveClinic = async () => {
        try {
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/admin/clinics/${currentClinic._id}`, currentClinic);
                showSnackbar('Cập nhật phòng khám thành công', 'success');
            } else {
                await axios.post(`${API_BASE_URL}/admin/clinics`, currentClinic);
                showSnackbar('Thêm phòng khám thành công', 'success');
            }
            fetchClinics();
            closeBox();
        } catch (err) {
            console.error("Lỗi khi lưu phòng khám:", err);
            showSnackbar('Lỗi khi lưu phòng khám', 'error');
        }
    };

    const deleteClinic = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa phòng khám này không?')) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/clinics/${id}`);
                fetchClinics();
                showSnackbar('Xóa phòng khám thành công', 'success');
            } catch (err) {
                console.error("Lỗi khi xóa phòng khám:", err);
                showSnackbar('Lỗi khi xóa phòng khám', 'error');
            }
        }
    };

    const toggleClinicStatus = async (id) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/admin/clinics/${id}/status`);
            setClinics(prev =>
                prev.map(clinic => (clinic._id === id ? res.data : clinic))
            );
            showSnackbar('Cập nhật trạng thái thành công', 'success');
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái:", err);
            showSnackbar('Lỗi khi cập nhật trạng thái', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <div className="container mt-4">
            <h2>Quản lý phòng khám</h2>
            <Button className="mb-3" onClick={() => openBox()}>+ Thêm phòng khám</Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Địa chỉ</th>
                        <th>Mô tả</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {clinics.map(clinic => (
                        <tr key={clinic._id}>
                            <td>{clinic.name}</td>
                            <td>{clinic.address}</td>
                            <td>{clinic.description}</td>
                            <th>{clinic.phone}</th>
                            <td>
                                <Switch
                                    checked={clinic.isActive}
                                    onChange={() => toggleClinicStatus(clinic._id)}
                                    color="success"
                                />
                                {clinic.isActive ? '' : ''}
                            </td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => openBox(clinic)}>Sửa</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => deleteClinic(clinic._id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Popup Form */}
            {showBox && (
                <>
                    <div
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1040
                        }}
                        onClick={closeBox}
                    />
                    <div
                        style={{
                            position: 'fixed', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white', padding: '20px',
                            borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                            width: '400px', zIndex: 1050
                        }}
                    >
                        <h5>{isEditing ? 'Chỉnh sửa' : 'Thêm'} phòng khám</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên phòng khám</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentClinic.name || ''}
                                    onChange={(e) => setCurrentClinic({ ...currentClinic, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentClinic.address || ''}
                                    onChange={(e) => setCurrentClinic({ ...currentClinic, address: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentClinic.phone || ''}
                                    onChange={(e) => setCurrentClinic({ ...currentClinic, phone: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea" rows={3}
                                    value={currentClinic.description || ''}
                                    onChange={(e) => setCurrentClinic({ ...currentClinic, description: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={closeBox} className="me-2">Đóng</Button>
                            <Button variant="primary" onClick={saveClinic}>
                                {isEditing ? 'Cập nhật' : 'Thêm'}
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ClinicsAdminPage;
