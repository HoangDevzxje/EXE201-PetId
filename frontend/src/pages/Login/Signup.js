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
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
            <div className="card shadow-lg overflow-hidden" style={{ maxWidth: "650px" }}>
                <div className="row g-0">
                    <div className="col-md-7 p-4 d-flex flex-column justify-content-center">
                        <div className="text-center mb-3">
                            <FaUser size={40} className="text-primary" />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            {/* Trường nhập Name */}
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaUser /></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            {/* Trường email */}
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Trường số điện thoại */}
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaPhone /></span>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Trường mật khẩu */}
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaLock /></span>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Trường xác nhận mật khẩu */}
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaLock /></span>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Nút đăng ký */}
                            <button type="submit" className="btn btn-primary w-100">
                                Sign Up
                            </button>
                        </form>

                        {/* Liên kết đến trang đăng nhập */}
                        <p className="mt-2 text-center">
                            Already have an account?{" "}
                            <a href="/login" className="text-decoration-none">
                                Login
                            </a>
                        </p>
                    </div>

                    {/* Hình ảnh banner */}
                    <div className="col-md-5 d-none d-md-block">
                        <img src="/login.jpg" alt="Sign Up Banner" className="img-fluid h-100" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;