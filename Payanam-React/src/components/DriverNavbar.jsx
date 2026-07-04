// src/components/DriverNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const DriverNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold text-secondary" to="/">
          <img
            src="assets/payanam-logo-1.png"
            alt="Payanam"
            width="270"
            height="75"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#driverNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="driverNavbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DriverNavbar;
