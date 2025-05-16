import { Link, useLocation } from "react-router-dom";
import "./SidebarAdmin.css";

const SidebarAdmin = () => {
  const location = useLocation();

  return (
    <div className="sidebar-admin">
      <ul>
        <li className={location.pathname === "/admin" ? "active" : ""}>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className={location.pathname === "/admin/events" ? "active" : ""}>
          <Link to="/admin/events">Events</Link>
        </li>
        <li
          className={location.pathname === "/admin/manageUser" ? "active" : ""}
        >
          <Link to="/admin/manageUser">Manage User</Link>
        </li>
        <li className={location.pathname === "/admin/movies" ? "active" : ""}>
          <Link to="/admin/movies">Movies</Link>
        </li>
        <li className={location.pathname === "/admin/showTime" ? "active" : ""}>
          <Link to="/admin/showTime">ShowTime</Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
