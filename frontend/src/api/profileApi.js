import api from "./baseApi"; // Import api đã cấu hình

const profileApi = {
    // Lấy thông tin cá nhân
    getProfile: async () => {
        try {
            const response = await api.get("/me");
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin cá nhân:", error);
            throw error;
        }
    },
    // Đổi mật khẩu
    changePassword: async (oldPassword, newPassword) => {
        try {
            const response = await api.post(
                "/auth/change-password",
                { oldPassword, newPassword }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            throw error;
        }
    }
};

export default profileApi;
