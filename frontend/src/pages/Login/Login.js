import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

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
        style={{ maxWidth: "650px" }}
      >
        <div className="row g-0">
          <div className="col-md-7 p-4 d-flex flex-column justify-content-center">
            <div className="text-center mb-3">
              <FaUser size={40} className="text-primary" />
            </div>
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}{" "}
            {/* Hiển thị lỗi */}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FaUser />
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
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <a
                href="forgotpassword"
                className="text-decoration-none d-block mb-2"
              >
                Forgot password?
              </a>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <p className="mt-2 text-center">
              Don't have an account?{" "}
              <a href="/register" className="text-decoration-none">
                Signup
              </a>
            </p>
          </div>

          <div className="col-md-5 d-none d-md-block">
            <img
              src="/login.jpg"
              alt="Login Banner"
              className="img-fluid h-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
