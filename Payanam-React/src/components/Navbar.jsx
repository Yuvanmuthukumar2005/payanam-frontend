// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ onLogout }) => {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name);
    // listen for storage changes from other tabs/windows
    const handler = (e) => {
      if (e.key === "userName") setUserName(e.newValue);
      if (e.key === "token" && !e.newValue) setUserName(null);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const updateUser = () => setUserName(localStorage.getItem("userName"));
    window.addEventListener("userLogin", updateUser);
    return () => window.removeEventListener("userLogin", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUserName(null);
    if (onLogout) onLogout();
    navigate("/Login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold text-secondary" to="/"><img src="assets/payanam-logo-1.png" alt="Payanam" width="270" height="75" /></Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/outstation">Outstation</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="authDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                Account
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/signup">User Signup</Link></li>
                <li><Link className="dropdown-item" to="/login">User Login</Link></li>
                <li><Link className="dropdown-item" to="/driversignup">Driver Signup</Link></li>
                <li><Link className="dropdown-item" to="/driverlogin">Driver Login</Link></li>
                <li><Link className="dropdown-item" to="/adminlogin">Admin Login</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/tracking">Tracking</Link>
            </li>

            {/* Right side: show user name + logout when logged in */}
            {userName ? (
              <li className="nav-item ms-3 d-flex align-items-center">
                <span className="navbar-username me-3">👤 {userName}</span>
                <button className="btn btn-sm btn-outline-dark logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
