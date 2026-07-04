import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css"; // keep your old CSS
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const data = await res.json();

      if (data.status === "SUCCESS") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userId", data.userId);
        toast.success("✅ Login successful");
        navigate("/"); // redirect to home page
        localStorage.setItem("userName", data.name);
        window.dispatchEvent(new Event("userLogin"));
      } else {
        toast.error("❌ Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Login blocked by security");
    }
  };

  return (
    <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5" style={{ background: "#f9f9f9" }}>
      <div className="card shadow-lg border-0 p-5" style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}>
        <h3 className="text-center fw-bold mb-4 text-warning">Welcome Back</h3>
        <form onSubmit={login}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold">Log In</button>
        </form>

        <div className="text-center mt-4">
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-warning fw-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
