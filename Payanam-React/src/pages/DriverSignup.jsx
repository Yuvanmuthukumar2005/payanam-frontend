import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { toast } from "react-toastify";

const DriverSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    licenseNo: "",
    vehicleNo: "",
    vehicleType: "",
    vehicleModel: "",
    password: "",
    confirmPassword: ""
  });

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const sendOTP = async () => {
    if (!formData.email) {
      toast.error("Enter email first");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/contact/sendotp?email=${formData.email}`, {
        method: "POST"
      });
      const msg = await res.text();
      setShowOtp(true);
      toast.info(msg);
    } catch {
      toast.error("Server error");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/contact/verify?email=${formData.email}&otp=${otp}`, {
        method: "POST"
      });
      const ok = await res.json();
      if (ok) {
        setOtpVerified(true);
        toast.success("OTP Verified ✅");
      } else {
        setOtpVerified(false);
        toast.error("Wrong OTP ❌");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const signupDriver = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!otpVerified) {
      toast.error("Please verify OTP first");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/driver/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const msg = await res.text();
      if (msg.trim() === "SUCCESS") {
        toast.info("Driver Registered Successfully, Kindly wait for the Verification");
        navigate("/driverlogin");
      } else {
        toast.error(msg);
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <main className="container py-5">
      <div className="row align-items-center">
        {/* LEFT: SIGN UP FORM */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-lg border-0 p-4 signup-card">
            <h3 className="text-center fw-bold mb-4 text-warning">Driver Register</h3>
            <form onSubmit={signupDriver}>
              <input id="name" placeholder="Full Name" className="form-control mb-3" onChange={handleChange} required />
              <input id="mobile" placeholder="Mobile Number" className="form-control mb-3" onChange={handleChange} required />
              <input id="email" type="email" placeholder="Email" className="form-control mb-3" onChange={handleChange} required />
              <button type="button" className="btn btn-secondary mb-3" onClick={sendOTP}>Send OTP</button>

              {showOtp && (
                <div className="mb-3">
                  <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="form-control" />
                  <button type="button" className="btn btn-success mt-2" onClick={verifyOTP}>Verify OTP</button>
                </div>
              )}

              <input id="licenseNo" placeholder="License No" className="form-control mb-3" onChange={handleChange} required />
              <input id="vehicleNo" placeholder="Vehicle No" className="form-control mb-3" onChange={handleChange} required />
              <input id="vehicleType" placeholder="Vehicle Type" className="form-control mb-3" onChange={handleChange} required />
              <input id="vehicleModel" placeholder="Vehicle Model" className="form-control mb-3" onChange={handleChange} required />
              <input id="password" type="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
              <input id="confirmPassword" type="password" placeholder="Confirm Password" className="form-control mb-3" onChange={handleChange} required />

              <button type="submit" className="btn btn-warning w-100 fw-bold">Sign Up as Driver</button>
            </form>

            <div className="text-center mt-3">
              <p>Already have an account? <Link to="/driverlogin" className="text-warning fw-semibold">Log in</Link></p>
            </div>
          </div>
        </div>

        {/* RIGHT: ABOUT PAYANAM */}
        <div className="col-lg-7">
          <h2 className="fw-bold text-warning mb-3">Why Drive with Payanam?</h2>
          <p className="text-muted">
            Payanam is a <strong>driver-first cab platform</strong> built from real-life experiences.
            We understand the challenges drivers face every day.
          </p>
          <blockquote className="border-start border-warning ps-3 fst-italic text-dark">
            “If we go offline, we don’t get our incentives.”
          </blockquote>
          <p>
            That single sentence inspired Payanam — a platform where drivers don’t have to
            sacrifice their <strong>health for earnings</strong>.
          </p>
          <ul className="list-unstyled mt-4">
            <li className="mb-2">🚘 Take breaks without logging out</li>
            <li className="mb-2">🛑 No trip requests during break time</li>
            <li className="mb-2">💰 Incentives continue during approved breaks</li>
            <li className="mb-2">❤️ Designed with driver health in mind</li>
            <li className="mb-2">🤝 Drivers treated as partners, not numbers</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM: DRIVER BENEFITS */}
      <div className="row mt-5">
        <div className="col-12 text-center">
          <h3 className="fw-bold text-warning mb-4">Benefits of Being a Payanam Driver</h3>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm text-center p-3 benefit-card">
            <h5>🛑 Smart Break System</h5>
            <p className="text-muted">Take meals and rest without losing incentives or going offline.</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm text-center p-3 benefit-card">
            <h5>💰 Fair Incentives</h5>
            <p className="text-muted">Earn consistently without pressure to stay active nonstop.</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm text-center p-3 benefit-card">
            <h5>❤️ Health & Safety First</h5>
            <p className="text-muted">Balanced work hours mean safer roads and happier drivers.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DriverSignup;
