import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import signupApi from "../../api/signupApi";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { name, email, password, phone, type } = location.state || {}; // Lấy type từ location.state

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            console.log("Verifying OTP for:", { email, otp, type });

            // Gọi API xác thực OTP với type
            const verifyResponse = await signupApi.verifyOtp(email, otp, type);
            console.log("Verify OTP Response:", verifyResponse);

            if (verifyResponse.message === "OTP xác thực thành công!") {
                // Xử lý tiếp theo dựa trên type
                if (type === "register") {
                    // Đăng ký người dùng
                    const signupResponse = await signupApi.signup(name, email, password, phone);
                    console.log("Signup Response:", signupResponse);

                    if (signupResponse.message === "Đăng ký thành công!") {
                        navigate("/login"); // Chuyển hướng đến trang đăng nhập
                    } else {
                        setError(signupResponse.message || "Failed to sign up.");
                    }
                } else if (type === "reset-password") {
                    // Chuyển hướng đến trang đặt lại mật khẩu
                    navigate("/reset-password", { state: { email } });
                }
            } else {
                setError(verifyResponse.message || "Invalid OTP.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to verify OTP.");
            console.error("OTP verification failed", error);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-sm border-0 rounded-3 p-3" style={{ maxWidth: "350px" }}>
                <div className="text-center mb-3">
                    <h4 className="fw-bold">Xác thực OTP</h4>
                    <p className="text-muted mb-2">Nhập mã OTP gửi đến email</p>
                </div>

                {error && <div className="alert alert-danger text-center py-1">{error}</div>}

                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control text-center fw-semibold"
                            placeholder="Nhập OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={{ letterSpacing: "2px" }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>


    );
};

export default VerifyOtp;