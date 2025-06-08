import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button, Badge } from "react-bootstrap";
import { Snackbar, Alert } from "@mui/material";
import api from "../../api/baseApi";

const AppointmentsAdminPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/admin/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lịch hẹn:", err);
      showSnackbar("Lỗi khi tải lịch hẹn", "error");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch hẹn này không?")) {
      try {
        await api.delete(`/admin/appointments/${id}`);
        showSnackbar("Xóa lịch hẹn thành công", "success");
        fetchAppointments();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        showSnackbar("Xóa thất bại", "error");
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container className="mt-4">
      <h2>Đơn hàng phòng khám (Lịch hẹn)</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>SĐT</th>
            <th>Dịch vụ</th>
            <th>Lời nhắn</th>
            <th>Phòng khám</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app._id}>
              <td>{app.name}</td>
              <td>{app.phone}</td>
              <td>
                <Badge bg="info">{app.service}</Badge>
              </td>
              <td>{app.note || "-"}</td>
              <td>{app.clinic?.name || "N/A"}</td>
              <td>{new Date(app.createdAt).toLocaleString()}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteAppointment(app._id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppointmentsAdminPage;
