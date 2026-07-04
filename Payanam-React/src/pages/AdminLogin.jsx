import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/adminlogin.css";
import { toast } from "react-toastify";


const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const ADMIN_EMAIL = "admin@payanam.com";
  const ADMIN_PASS = "admin123";

  const login = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter email & password");
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      toast.success("Admin login successful");
      localStorage.setItem("isAdmin", "true");
      if (onLoginSuccess) onLoginSuccess();
      navigate("/AdminDashboard");
    } else {
      toast.error( "Enter Valid email & password");
    }
  };

  return (
    <div className="login-card">
      <h3 className="text-center mb-4">PAYANAM ADMIN</h3>
      <form onSubmit={login}>
        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-warning w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
