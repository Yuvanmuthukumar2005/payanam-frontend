import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";
import { toast } from "react-toastify";

const API = "http://localhost:8080/admin";



const AdminDashboard = () => {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();


  // Load data on mount
  useEffect(() => {
    loadPendingDrivers();
    loadAllDrivers();
    loadTrips();
  }, []);

  const loadPendingDrivers = async () => {
    const res = await fetch(API + "/drivers/pending");
    const drivers = await res.json();
    setPendingDrivers(drivers);
  };

  const loadAllDrivers = async () => {
    const res = await fetch(API + "/drivers");
    const drivers = await res.json();
    setAllDrivers(drivers);
  };

  const verifyDriver = async (id) => {
    await fetch(API + "/driver/" + id + "/verify", { method: "PUT" });
    toast.success("You have been accepted this Driver request, Driver Verified!");
    loadPendingDrivers();
    loadAllDrivers();
  };

  const rejectDriver = async (id) => {
    if (!window.confirm("Reject this driver?")) return;
    await fetch(API + "/driver/" + id + "/reject", { method: "PUT" });
    toast.error("You have been rejected this Driver, Driver Rejected!");
    loadPendingDrivers();
    loadAllDrivers();
  };

  const loadTrips = async () => {
    const res = await fetch(API + "/trips");
    const tripsData = await res.json();
    setTrips(tripsData);
    let revenue = 0;
    tripsData.forEach(t => revenue += t.fare || 0);
    setTotalRevenue(revenue);
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h3>Welcome Admin 👋</h3>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total Drivers</h5>
              <h2>{allDrivers.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total Trips</h5>
              <h2>{trips.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h2>₹ {totalRevenue}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#pending">Pending Drivers</button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#drivers">All Drivers</button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#trips">All Trips</button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Pending Drivers */}
        <div className="tab-pane fade show active" id="pending">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">Pending Driver Verification</div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th><th>Vehicle</th><th>License</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDrivers.map(d => (
                    <tr key={d.id}>
                      <td>{d.user?.name || "No Name"}</td>
                      <td>{d.vehicleNo || "-"}</td>
                      <td>{d.licenseNo || "-"}</td>
                      <td>
                        <button className="btn btn-success btn-sm me-2" onClick={() => verifyDriver(d.id)}>Verify</button>
                        <button className="btn btn-danger btn-sm" onClick={() => rejectDriver(d.id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* All Drivers */}
        <div className="tab-pane fade" id="drivers">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">All Drivers</div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th><th>Vehicle</th><th>Status</th><th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {allDrivers.map(d => (
                    <tr key={d.id}>
                      <td>{d.user?.name || ""}</td>
                      <td>{d.vehicleNo || ""}</td>
                      <td>{d.onlineStatus || ""}</td>
                      <td>{d.verified ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* All Trips */}
        <div className="tab-pane fade" id="trips">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">All Trips</div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th><th>Passenger</th><th>Driver</th><th>Fare</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map(t => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.passengerName || "-"}</td>
                      <td>{t.driver?.user?.name || "-"}</td>
                      <td>₹ {t.fare || 0}</td>
                      <td>{t.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-outline-danger mt-4" onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
