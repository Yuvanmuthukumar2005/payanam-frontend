// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light mt-5 pt-4 pb-3">
      <div className="container">
       <div className="row">
        {/* Brand */}
        <div className="col-md-3 mb-3">
          <h5 className="fw-bold">Payanam</h5>
          <p>Connecting people with safe and reliable rides across Tamil Nadu.</p>
        </div>

        {/* Quick Links */}
        <div className="col-md-3 mb-3">
          <h5 className="fw-bold">Quick Links</h5>
          <ul className="list-unstyled">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
            <li><Link to="/outstation" className="footer-link">Outstation</Link></li>
            <li><Link to="/tracking" className="footer-link">Tracking</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-md-3 mb-3">
          <h5 className="fw-bold">Contact Us</h5>
          <p>Email: support@payanam.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Chennai, Tamil Nadu</p>
        </div>

        {/* Social Icons */}
        <div className="col-md-3 mb-3">
          <h5 className="fw-bold">Follow Us</h5>
          <div className="social-icons d-flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

        <hr className="border-light" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} Payanam. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
