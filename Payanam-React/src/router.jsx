// src/router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Outstation from "./pages/Outstation";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DriverSignup from "./pages/DriverSignup";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import DriverHistory from "./pages/DriverHistory";
import UserHistory from "./pages/UserHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Tracking from "./pages/Tracking";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/outstation" element={<Outstation />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/driversignup" element={<DriverSignup />} />
      <Route path="/driverlogin" element={<DriverLogin />} />
      <Route path="/driverdashboard" element={<DriverDashboard />} />
      <Route path="/driverhistory" element={<DriverHistory />} />
      <Route path="/userhistory" element={<UserHistory />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/tracking" element={<Tracking />} />
    </Routes>
  );
};

export default AppRoutes;
