import api from "../api/baseApi";
export const fetchUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data; // { userId, role }
  } catch (error) {
    return null;
  }
};
