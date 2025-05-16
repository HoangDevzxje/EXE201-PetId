import { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotPasswordApi from "../../api/forgotpasswordApi";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Gửi OTP, 2: Nhập OTP, 3: Đặt mật khẩu
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Hàm kiểm tra mật khẩu hợp lệ
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    };

    // Xử lý gửi OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            await forgotPasswordApi.sendOtp(email, "reset-password");
            setStep(2); // Chuyển sang bước nhập OTP
        } catch (error) {
            setErrorMessage("Không thể gửi OTP. Vui lòng thử lại.");
        }
    };

    // Xử lý xác nhận OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            await forgotPasswordApi.verifyOtp(email, otp, "reset-password");
            setStep(3); // Chuyển sang bước đặt mật khẩu mới
        } catch (error) {
            setErrorMessage("OTP không hợp lệ. Vui lòng thử lại.");
        }
    };

    // Xử lý đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu nhập lại không khớp.");
            return;
        }

        if (!validatePassword(newPassword)) {
            setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự, gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.");
            return;
        }

        try {
            await forgotPasswordApi.resetPassword(email, newPassword);
            alert("Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập.");
            navigate("/login");
        } catch (error) {
            setErrorMessage("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "450px", width: "100%" }}>
                <h3 className="text-center mb-3">Quên Mật Khẩu</h3>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><FaEnvelope /></span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Gửi OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><FaKey /></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Xác Nhận OTP</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><FaLock /></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><FaLock /></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Đặt Lại Mật Khẩu</button>
                    </form>
                )}

                <p className="mt-3 text-center">
                    <a href="/login" className="text-decoration-none">Quay lại Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
