import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State để lưu lỗi đăng nhập
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset lỗi trước khi thử đăng nhập

    try {
      const loggedInUser = await login(email, password); // Nhận dữ liệu user ngay sau khi đăng nhập

      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your email and password.");
      console.error("Login failed", error);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div
        className="card shadow-lg overflow-hidden"
        style={{ maxWidth: "480px", width: "100%", backgroundColor: "#C49A6C" }}
      >
        <div className="card-body p-4 text-center">
          {/* Đổi màu icon thành trắng */}
          <FaUser size={48} style={{ color: "#fff" }} className="mb-2" />
          <h3 className="mb-4" style={{ color: "#fff" }}>
            Đăng nhập
          </h3>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label visually-hidden">
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text" id="email-addon">
                  <FaUser />
                </span>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Email"
                  aria-describedby="email-addon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label visually-hidden">
                Mật khẩu
              </label>
              <div className="input-group">
                <span className="input-group-text" id="password-addon">
                  <FaLock />
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  aria-describedby="password-addon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mb-3">
              <Link to="/forgotpassword" className="text-decoration-none small" style={{ color: "#fff" }}>
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút đổi thành nền trắng chữ màu #C49A6C (màu background của navbar) */}
            <button
              type="submit"
              className="btn w-100 fw-semibold"
              style={{
                fontSize: "1rem",
                backgroundColor: "#fff",
                color: "#C49A6C",
                borderColor: "#fff",
              }}
            >
              Đăng nhập
            </button>
          </form>

          <p className="mt-3 small" style={{ color: "#fff" }}>
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: "#fff" }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>


  );
};

export default Login;
