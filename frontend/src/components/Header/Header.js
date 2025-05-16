import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="header">
      <div className="logo">
        <img src="../cinema-bg.png"></img>
      </div>
      <div className="nav-links">
        <div>
          <Link to="/">HOME</Link>
        </div>
        <div>
          <Link to="/movies">MOVIES</Link>
        </div>
        <div>
          <Link to="/promotion">EVENTS</Link>
        </div>
        <div>
          <Link to="/">NOTIFICATIONS</Link>
        </div>
      </div>
      <div className="auth">
        <div>
          <Link to="/">CONTACT</Link>
        </div>
        {user ? (
          <>
            {/* <span>Welcome, {user.name}</span> */}
            <div>
              <Link to="/me">PROFILE</Link>
            </div>
            <button onClick={logout}>LOGOUT</button>
          </>
        ) : (
          <Link to="/login">LOGIN</Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
