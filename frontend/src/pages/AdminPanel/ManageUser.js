import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api/userApi.js";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.getAllUser();
      setUsers(res.data);
    } catch (error) {
      console.log("Failed to fetch users: ", error);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const confirmChange = window.confirm(
      `Bạn có chắc muốn đổi role của user ${userId} từ "${currentRole}" sang "${
        currentRole === "user" ? "admin" : "user"
      }"?`
    );
    if (!confirmChange) return;

    try {
      const res = await api.updateUserRole(userId);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: res.data.role } : user
        )
      );
      alert(`Role của user ${userId} đã được chuyển thành ${res.data.role}`);
    } catch (error) {
      console.log("Failed to update role: ", error);
      alert("Có lỗi xảy ra khi cập nhật role!");
    }
  };

  const handleChangeStatus = async (userId, currentStatus) => {
    const confirmChange = window.confirm(
      `Bạn có chắc muốn đổi trạng thái của user ${userId} từ "${
        currentStatus ? "Active" : "Locked"
      }" sang "${!currentStatus ? "Active" : "Locked"}"?`
    );
    if (!confirmChange) return;

    try {
      const res = await api.updateUserStatus(userId);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: res.data.status } : user
        )
      );
      alert(
        `Trạng thái của user ${userId} đã được chuyển thành ${
          res.data.status ? "Active" : "Locked"
        }`
      );
    } catch (error) {
      console.log("Failed to update status: ", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  // Lọc danh sách người dùng theo email hoặc số điện thoại
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  return (
    <div className="content">
      <h1 className="mt-4">Manage User</h1>

      {/* Ô tìm kiếm */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo email hoặc số điện thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1"></i> List of users
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button
                      style={{ borderRadius: "0px", width: "100px" }}
                      className={`btn btn-sm btn-custom ${
                        user.role === "admin" ? "btn-info" : "btn-warning"
                      }`}
                      onClick={() => handleChangeRole(user._id, user.role)}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ borderRadius: "0px", width: "100px" }}
                      className={`btn btn-sm btn-custom ${
                        user.status ? "btn-success" : "btn-danger"
                      }`}
                      onClick={() => handleChangeStatus(user._id, user.status)}
                    >
                      {user.status ? "Active" : "Locked"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="text-center text-muted">Không tìm thấy kết quả</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUser;
