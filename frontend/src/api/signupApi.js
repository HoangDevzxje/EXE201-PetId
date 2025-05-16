import api from "./baseApi"; // Đảm bảo import đúng file API

const signupApi = {
    sendOtp: async (email, type) => {
        try {
            const response = await api.post("/auth/send-otp", { email, type });
            return response.data;
        } catch (error) {
            console.error("Error sending OTP", error);
            throw error;
        }
    },

    verifyOtp: async (email, otp, type) => {
        try {
            const response = await api.post("/auth/verify-otp", { email, otp, type });
            return response.data;
        } catch (error) {
            console.error("Error verifying OTP", error);
            throw error;
        }
    },

    signup: async (name, email, password, phone) => {
        try {
            const response = await api.post("/auth/register", { name, email, password, phone });
            return response.data;
        } catch (error) {
            console.error("Error during registration", error);
            throw error;
        }
    },
};

export default signupApi;