import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/baseApi"; // axios instance with baseURL & withCredentials

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1. Kiểm tra phiên đăng nhập khi app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ 2. Đăng nhập: Gửi credentials + fetch lại user
  const login = async (email, password) => {
    try {
      await api.post("/auth/login", { email, password });
      const res = await api.get("/auth/me");
      setUser(res.data);
      return res.data; // Trả về user để client xử lý điều hướng
    } catch (error) {
      throw error; // Cho phép component xử lý lỗi (hiển thị message)
    }
  };

  // ✅ 3. Đăng xuất
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      window.location.href = "/"; // Reload UI
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
