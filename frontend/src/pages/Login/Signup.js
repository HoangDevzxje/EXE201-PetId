import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import signupApi from "../../api/signupApi"; // Đảm bảo import đúng

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!validatePassword(password)) {
            setError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt!");
            return;
        }

        try {
            console.log("Requesting OTP for:", { email });

            // Gửi yêu cầu OTP với loại OTP là "register"
            const otpResponse = await signupApi.sendOtp(email, "register");
            console.log("OTP API Response:", otpResponse);

            if (otpResponse.message) {
                // Chuyển hướng đến trang xác thực OTP
                navigate("/verify-otp", { state: { name, email, password, phone, type: "register" } });
            } else {
                setError(otpResponse.message || "Failed to send OTP.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send OTP.");
            console.error("OTP request failed", error);
        }
    };



    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "70vh" }}
        >
            <div className="card shadow-lg overflow-hidden" style={{ maxWidth: "480px", width: "100%" }}>
                <div className="p-4 d-flex flex-column justify-content-center" style={{ backgroundColor: "#C49A6C" }}>
                    <div className="text-center mb-2">
                        <FaUser size={40} style={{ color: "#fff" }} />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Họ và tên */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaUser />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaEnvelope />
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaPhone />
                            </span>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Nút đăng ký */}
                        <button
                            type="submit"
                            className="btn w-100 fw-semibold"
                            style={{
                                backgroundColor: "#fff",
                                color: "#C49A6C",
                                borderColor: "#fff",
                                fontSize: "1rem",
                            }}
                        >
                            Đăng ký
                        </button>
                    </form>

                    {/* Đường dẫn đến đăng nhập */}
                    <p className="mt-3 text-center" style={{ color: "#fff" }}>
                        Đã có tài khoản?{" "}
                        <a href="/login" className="text-decoration-none fw-semibold" style={{ color: "#fff" }}>
                            Đăng nhập
                        </a>
                    </p>
                </div>
            </div>
        </div>




    );
};

export default SignUp;