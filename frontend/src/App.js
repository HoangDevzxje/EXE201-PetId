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
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import ProtectedRoute from "./routes/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer/Footer";

import Promotion from "./pages/Promotion/Promotion";
import PromotionDetail from "./pages/Promotion/PromotionDetail";

import MovieDetail from "./pages/Movie/DetailMovie";

import SignUp from "./pages/Login/Signup";
import VerifyOtp from "./pages/Login/verifyOtp";
import Showtime from "./pages/Movie/Showtime";
import HeaderAdmin from "./components/HeaderAdmin/HeaderAdmin";
import FooterAdmin from "./components/FooterAdmin/FooterAdmin";
import AdminEvents from "./pages/AdminPanel/AdminEvents";
import AdminMovies from "./pages/AdminPanel/AdminMovies";
import Movies from "./pages/Movie/Movies";
import AdminShowTime from "./pages/AdminPanel/AdminShowTime";
import MovieDetailAdmin from "./pages/AdminPanel/DetailMovieForAdmin";
import ForgotPassword from "./pages/Login/forgotPassword";
import Profile from "./pages/Login/profile";
import SideBarAdmin from "./components/SideBarAdmin/SideBarAdmin";
import ManageUser from "./pages/AdminPanel/ManageUser";
import ShowtimeDetail from "./pages/Movie/ShowtimeDetail";
import PaymentSusses from "./pages/Movie/PaymentSusses";

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
            <Route path="/movies" element={<Movies />} />
            <Route path="/detail/:movieId" element={<MovieDetail />} />
            <Route path="/showtime/:movieId" element={<Showtime />} />
            <Route
              path="/showtime-detail/:showtimeId"
              element={<ShowtimeDetail />}
            />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/promotion/:id" element={<PromotionDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/payment-success" element={<PaymentSusses />} />
            <Route
              path="/me"
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route
              path="/admin/manageUser"
              element={
                <ProtectedRoute role="admin">
                  <ManageUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <ProtectedRoute role="admin">
                  <AdminMovies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/showTime"
              element={
                <ProtectedRoute role="admin">
                  <AdminShowTime />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/detail/:movieId"
              element={
                <ProtectedRoute role="admin">
                  <MovieDetailAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
