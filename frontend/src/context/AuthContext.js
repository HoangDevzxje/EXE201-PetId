import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/baseApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch user khi app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // 2️⃣ Hàm login (Gửi email & password đến backend)
  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    const res = await api.get("/auth/me");
    setUser(res.data);
    return res.data; // Trả về user sau khi fetch
  };

  // 3️⃣ Hàm logout (Xóa cookie từ backend)
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    window.location.href = "/"; // Reload UI
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
