import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Real-time expert scheduling</p>
        <NavLink className="brand" to="/experts">
          Expert Booking System
        </NavLink>
      </div>

      <nav className="topnav">
        <NavLink
          to="/experts"
          className={({ isActive }) => `topnav-link${isActive ? " is-active" : ""}`}
        >
          Experts
        </NavLink>
        <NavLink
          to="/my-bookings"
          className={({ isActive }) => `topnav-link${isActive ? " is-active" : ""}`}
        >
          My Bookings
        </NavLink>
        <NavLink
          to="/admin/bookings"
          className={({ isActive }) => `topnav-link${isActive ? " is-active" : ""}`}
        >
          Admin
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
