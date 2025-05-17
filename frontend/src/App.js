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
//import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer/Footer";
import SearchPage from "./pages/Product/SearchPage";
import SignUp from "./pages/Login/Signup";
import VerifyOtp from "./pages/Login/verifyOtp";
import HeaderAdmin from "./components/HeaderAdmin/HeaderAdmin";
import FooterAdmin from "./components/FooterAdmin/FooterAdmin";
import ForgotPassword from "./pages/Login/forgotPassword";
import Profile from "./pages/Login/profile";
import SideBarAdmin from "./components/SideBarAdmin/SideBarAdmin";
import ProductDetail from "./pages/Product/ProductDetail";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="layout">
      {isAdminRoute ? <HeaderAdmin /> : <Header />}
      <div className="main-container">
        {isAdminRoute && <SideBarAdmin />}
        <div className="content">{children}</div>
      </div>
      {isAdminRoute ? <FooterAdmin /> : <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/me"
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            /> */}

            {/* <Route
              path="/admin/manageUser"
              element={
                <ProtectedRoute role="admin">
                  <ManageUser />
                </ProtectedRoute>
              }
            /> */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
