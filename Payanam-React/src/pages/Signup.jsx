import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css"; 
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        })
      });

      const msg = await response.text();

      if (msg === "SUCCESS") {
        toast.success("✅ Signup successful");
        navigate("/Login"); // React route or page
      } else {
        toast.info("❌ Email already exists");
      }
    } catch (err) {
      toast.error("⚠️ Signup failed: " + err.message);
    }
  };

  return (
    <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5" style={{ background: "#f9f9f9" }}>
      <div className="card shadow-lg border-0 p-5" style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}>
        <h3 className="text-center fw-bold mb-4 text-warning">Create Account</h3>
        <form onSubmit={signup}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" name="name" className="form-control" placeholder="Your name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Mobile</label>
            <input type="tel" name="mobile" className="form-control" placeholder="Mobile No" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-control" placeholder="Re-Enter password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold">Sign Up</button>
        </form>

        <div className="text-center mt-4">
          <p>Already have an account?{" "} <Link to="/Login" className="text-warning fw-semibold">Log in</Link></p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
