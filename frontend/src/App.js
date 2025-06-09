import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  useLocation,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer/Footer";
import SearchPage from "./pages/Product/SearchPage";
import SignUp from "./pages/Login/Signup";
import VerifyOtp from "./pages/Login/verifyOtp";
import ProductManagement from "./pages/Admin/ProductManagement";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import OrderManagement from "./pages/Admin/OrderManagement";
import ForgotPassword from "./pages/Login/forgotPassword";
import Profile from "./pages/Login/profile";
import ProductDetail from "./pages/Product/ProductDetail";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/Cart/CartPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import OrderHistoryPage from "./pages/Order/OrderHistoryPage";
import ChatBot from "./components/ChatBot/ChatBot";
import Product from "./pages/Product/Product";
import PetManagement from "./pages/Home/PetManagement";
import PetDetail from "./pages/Home/PetDetail";
import PetReminderManager from "./pages/Home/PetReminderManager";
import UserManagement from "./pages/Admin/UserManagement";
import ClinicsAdminPage from "./pages/Admin/ClinicsAdminPage";
import AdminLayout from "./components/HeaderAdmin/AdminLayout";
import CreatePetButton from "./pages/Home/CreatePetButton";
import PetList from "./pages/Home/Petlist";
import PetListButton from "./pages/Home/PetListButton";
import PetEdit from "./pages/Home/PetEdit";
import ClinicsUserPage from "./pages/Clinic/ClinicsUserPage";
import ClinicDetailPage from "./pages/Clinic/ClinicsDetailPage";
import AppointmentsAdminPage from "./pages/Admin/AppointmentsAdminPage";
import BlogManagement from "./pages/Admin/BlogManagement";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPetDetailPage = /^\/pets\/[^/]+$/.test(location.pathname);
  const isPetEditPage = /^\/pets\/[^/]+\/edit$/.test(location.pathname);
  const isPetManagementPage = location.pathname === "/pets/manage";
  const isProfilePage = location.pathname === "/me";
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Ẩn các thành phần khi ở trang chi tiết, edit, hoặc quản lý thú cưng
  const hideFloating = isPetEditPage || isPetManagementPage;
  const hideFooter =
    isPetDetailPage || isPetEditPage || isPetManagementPage || isProfilePage;

  return (
    <div className="layout">
      <Header />
      <div className="main-container">
        <div className="content">{children}</div>
      </div>
      {!hideFloating && (
        <>
          <ChatBot />

          <CreatePetButton />
        </>
      )}
      {!hideFooter && (
        <>
          <PetListButton />
          <Footer />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/clinics" element={<ClinicsUserPage />} />
              <Route path="/clinics/detail" element={<ClinicDetailPage />} />
              <Route
                path="/pets"
                element={
                  <ProtectedRoute role="user">
                    <PetList />
                  </ProtectedRoute>
                }
              />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pets/:petId" element={<PetDetail />} />
              <Route path="/pets/:petId/edit" element={<PetEdit />} />{" "}
              {/* Thêm dòng này */}
              <Route path="/chatbot" element={<ChatBot />} />
              =======
              {/* Protected User Routes */}
              <Route
                path="/pets/manage"
                element={
                  <ProtectedRoute role="user">
                    <PetManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/me"
                element={
                  <ProtectedRoute role="user">
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pets"
                element={<ProtectedRoute role="user"></ProtectedRoute>}
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute role="user">
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute role="user">
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route
                path="/pets/:petId/reminders"
                element={<PetReminderManager />}
              />
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="clinics" element={<ClinicsAdminPage />} />
                <Route
                  path="appointments"
                  element={<AppointmentsAdminPage />}
                />
                <Route path="blogs" element={<BlogManagement />} />
              </Route>
            </Routes>
          </Layout>
          <ToastContainer position="top-right" autoClose={2000} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
