import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { toast } from "react-toastify";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginDriver = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("⚠️ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.status === 403) {
        const msg = await res.text();
        if (msg.includes("NOT_VERIFIED")) {
          toast.info("🚫 Your account is not verified yet.\nPlease wait for admin approval.");
        } else {
          toast.error("❌ Your account was rejected.");
        }
        return;
      }

      if (!res.ok) throw new Error("INVALID");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("driverId", data.driverId);
      localStorage.setItem("driverName", data.driverName);
      toast.success("Login Successful ✅");
      navigate("/DriverDashboard");
    } catch {
      toast.error("❌ Invalid Email or Password");
    }
  };

  return (
    <main className="container py-5">
      <div className="card shadow p-4 border-0" style={{ maxWidth: "420px", margin: "auto" }}>
        <h3 className="text-center text-warning fw-bold mb-4">Driver Login</h3>
        <form onSubmit={loginDriver}>
          <input type="email" className="form-control mb-3" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="form-control mb-3" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-warning w-100 fw-bold">Login</button>
        </form>
        <div className="text-center mt-3">
          <p>New Driver? <Link to="/DriverSignup" className="text-warning fw-semibold">Register here</Link></p>
        </div>
      </div>
    </main>
  );
};

export default DriverLogin;
