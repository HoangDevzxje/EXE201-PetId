const router = require("express").Router();
const authController = require("../controllers/AuthController");
const { checkAuthorize } = require("../middleware/authMiddleware");
// Xử lý OTP
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// Đăng ký người dùng
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Đăng xuất
router.post("/logout", authController.logout);

// Lấy thông tin cá nhân
router.get("/me", authController.getMe);

// Rest mật khẩu
router.post("/reset-password", authController.resetPassword);

// Thay đổi mật khẩu
router.post(
  "/change-password",
  checkAuthorize(["user"]),
  authController.changePassword
);

module.exports = router;
