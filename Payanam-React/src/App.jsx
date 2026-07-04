// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import DriverNavbar from "./components/DriverNavbar";
import Footer from "./components/Footer";

// User pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Outstation from "./pages/Outstation";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Tracking from "./pages/Tracking";
import UserHistory from "./pages/UserHistory";

// Driver/Admin pages
import DriverSignup from "./pages/DriverSignup";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import DriverHistory from "./pages/DriverHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Layouts
const UserLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const DriverLayout = () => (
  <>
    <DriverNavbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes with Navbar + Footer */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/outstation" element={<Outstation />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/userhistory" element={<UserHistory />} />
        </Route>

        {/* Driver/Admin routes without Navbar/Footer */}
        <Route element={<DriverLayout />}>
          <Route path="/driversignup" element={<DriverSignup />} />
          <Route path="/driverlogin" element={<DriverLogin />} />
          <Route path="/driverdashboard" element={<DriverDashboard />} />
          <Route path="/driverhistory" element={<DriverHistory />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
      {/* Global toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
