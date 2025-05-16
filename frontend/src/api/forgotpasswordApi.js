import api from "./baseApi"; // Đảm bảo import đúng file API

const forgotPasswordApi = {
    sendOtp: async (email) => {
        try {
            const response = await api.post("/auth/send-otp", { email, type: "reset-password" });
            return response.data; // Trả về dữ liệu phản hồi từ API
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw error.response?.data?.message || "Có lỗi xảy ra khi gửi OTP!";
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const response = await api.post("/auth/verify-otp", { email, otp, type: "reset-password" });
            return response.data;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw error.response?.data?.message || "Có lỗi xảy ra khi xác thực OTP!";
        }
    },

    resetPassword: async (email, newPassword) => {
        try {
            const response = await api.post("/auth/reset-password", { email, newPassword });
            return response.data;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu!";
        }
    },
};

export default forgotPasswordApi;
