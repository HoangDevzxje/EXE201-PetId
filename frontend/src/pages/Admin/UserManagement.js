import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Tooltip,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9999/admin/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
      console.error("Lỗi khi tải người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      [user.name, user.email, user.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleRoleChange = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:9999/admin/users/${userId}/role`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? response.data : user))
      );
      setSnackbar({
        open: true,
        message: "Cập nhật vai trò thành công",
        severity: "success",
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật vai trò:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Cập nhật vai trò thất bại",
        severity: "error",
      });
    }
  };

  const handleStatusChange = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:9999/admin/users/${userId}/status`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? response.data : user))
      );
      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái thành công",
        severity: "success",
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Cập nhật trạng thái thất bại",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Tìm kiếm người dùng"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={`Chuyển thành ${user.role === "user" ? "admin" : "user"
                        }`}
                    >
                      <Button
                        variant="outlined"
                        color={user.role === "admin" ? "secondary" : "primary"}
                        size="small"
                        onClick={() => handleRoleChange(user._id)}
                      >
                        {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                      </Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status}
                      onChange={() => handleStatusChange(user._id)}
                      color="primary"
                    />
                    {user.status ? "Hoạt động" : "Không hoạt động"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
