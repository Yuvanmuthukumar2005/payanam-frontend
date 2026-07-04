import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/driver-dashboard.css";
import { toast } from "react-toastify"; 

const API_BASE = "http://localhost:8080";

const DriverDashboard = () => {
  const driverId = localStorage.getItem("driverId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [driverData, setDriverData] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [lastTripId, setLastTripId] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const pollingRef = useRef(null);
  const locationRef = useRef(null);

  // helper to include auth header
  const authFetch = (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    };
    return fetch(url, { ...options, headers });
  };

  // Redirect if no session
  useEffect(() => {
    if (!driverId) {
      toast.error("Session expired");
      navigate("/DriverLogin");
    }
  }, [driverId]);

  // Load dashboard stats
  const loadDashboard = async () => {
    try {
      const res = await authFetch(`${API_BASE}/driver/${driverId}/dashboard`);
      if (!res.ok) return;
      const data = await res.json();
      setDriverData(data);
    } catch (err) {
      console.error("loadDashboard error", err);
    }
  };

  // Load current trip (may return 204)
  const loadCurrentTrip = async () => {
    try {
      const res = await authFetch(`${API_BASE}/trip/current/${driverId}`);
      if (res.status === 204) {
        setCurrentTrip(null);
        setLastTripId(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch trip");
      const trip = await res.json();

      // handle cancellation
      if (trip.status === "CANCELLED_BY_USER") {
        toast.error("Passenger cancelled the ride ❌");
        setCurrentTrip(null);
        setLastTripId(null);
        await loadDashboard();
        return;
      }

      // new assignment detection
      if (trip.status === "ASSIGNED" && trip.id !== lastTripId) {
        toast.info("🚕 New Trip Assigned!");
        setLastTripId(trip.id);
      }

      setCurrentTrip(trip);
    } catch (err) {
      console.error("loadCurrentTrip error", err);
    }
  };

  // Trip actions
  const acceptTrip = async () => {
    if (!currentTrip) return;
    try {
      const res = await authFetch(`${API_BASE}/trip/accept/${currentTrip.id}`, { method: "PUT" });
      const trip = await res.json();
      setCurrentTrip(trip);
      toast.success("Trip Accepted ✅");
    } catch (err) {
      console.error("acceptTrip", err);
    }
  };

  const rejectTrip = async () => {
    if (!currentTrip) return;
    try {
      const res = await authFetch(`${API_BASE}/trip/reject/${currentTrip.id}`, { method: "PUT" });
      await res.json();
      toast.error("Trip Rejected ❌");
      setCurrentTrip(null);
      setLastTripId(null);
      // wait a bit then poll again
      setTimeout(loadCurrentTrip, 2000);
    } catch (err) {
      console.error("rejectTrip", err);
    }
  };

  const startTrip = async () => {
    if (!currentTrip) return;
    try {
      await authFetch(`${API_BASE}/trip/start/${currentTrip.id}`, { method: "PUT" });
      await loadCurrentTrip();
    } catch (err) {
      console.error("startTrip", err);
    }
  };

  const completeTrip = async () => {
    if (!currentTrip) return;
    try {
      await authFetch(`${API_BASE}/trip/complete/${currentTrip.id}`, { method: "PUT" });
      setCurrentTrip(null);
      await loadDashboard();
      await loadCurrentTrip();
    } catch (err) {
      console.error("completeTrip", err);
    }
  };

  // Status / break / online-offline
  const setStatus = async (status) => {
    try {
      await authFetch(`${API_BASE}/driver/${driverId}/status?status=${status}`, { method: "PUT" });
      await loadDashboard();
    } catch (err) {
      console.error("setStatus", err);
    }
  };

  const toggleBreak = async () => {
    try {
      await authFetch(`${API_BASE}/driver/${driverId}/break`, { method: "PUT" });
      await loadDashboard();
    } catch (err) {
      console.error("toggleBreak", err);
    }
  };

  // Driver history
  const loadDriverHistory = async () => {
    try {
      setLoadingHistory(true);
      const name = localStorage.getItem("driverName") || "";
      const res = await fetch(`${API_BASE}/trip/history/driver/${encodeURIComponent(name)}`);
      if (!res.ok) {
        setTripHistory([]);
        setLoadingHistory(false);
        return;
      }
      const trips = await res.json();
      setTripHistory(trips);
    } catch (err) {
      console.error("loadDriverHistory", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Filtered history for UI
  const filteredHistory = tripHistory.filter((t) => {
    const q = historyFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      (t.passengerName || "").toLowerCase().includes(q) ||
      (t.pickup || "").toLowerCase().includes(q) ||
      (t.dropLocation || "").toLowerCase().includes(q)
    );
  });

  // Geolocation reporting every 5s
  useEffect(() => {
    const sendLocation = async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        await authFetch(`${API_BASE}/driver/location?driverId=${driverId}&lat=${lat}&lng=${lng}`, {
          method: "POST",
        });
      } catch (err) {
        console.error("sendLocation error", err);
      }
    };

    locationRef.current = setInterval(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => sendLocation(pos),
        (err) => console.warn("geolocation error", err)
      );
    }, 5000);

    return () => {
      if (locationRef.current) clearInterval(locationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId, token]);

  // Poll dashboard & current trip every 3s
  useEffect(() => {
    loadDashboard();
    loadCurrentTrip();
    loadDriverHistory();

    pollingRef.current = setInterval(() => {
      loadDashboard();
      loadCurrentTrip();
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoutDriver = () => {
    localStorage.clear();
    navigate("/DriverLogin");
  };

  // UI helpers
  const statusText = () => {
    if (currentTrip) {
      if (currentTrip.status === "ASSIGNED") return { text: "TRIP REQUEST", cls: "break" };
      if (["ACCEPTED", "STARTED"].includes(currentTrip.status)) return { text: "ON TRIP", cls: "online" };
      if (currentTrip.status === "REJECTED") return { text: "REJECTED", cls: "offline" };
    }
    if (!driverData) return { text: "OFFLINE", cls: "offline" };
    if (driverData.onBreak) return { text: "ONLINE (ON BREAK)", cls: "break" };
    return { text: driverData.onlineStatus || "OFFLINE", cls: driverData.onlineStatus === "ONLINE" ? "online" : "offline" };
  };

  const breakText = () => (driverData && driverData.onBreak ? "On Break" : "Not on break");

  // Render
  return (
    <div>
      {/* Top bar */}
      <nav className="navbar custom-navbar bg-light border border-warning shadow px-3">
        <h1 className="navbar-brand">Driver Dashboard</h1>
        <div>
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => document.getElementById("historyTabBtn")?.click()}
          >
            Trip History
          </button>
          <button className="btn btn-warning btn-sm" onClick={logoutDriver}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-4">
        {/* STATUS CARD */}
        <div className="card shadow-sm mb-4 status-card">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4>
                Welcome, <span id="driverName">{localStorage.getItem("driverName")}</span>
              </h4>
              <p>
                Status: <strong id="statusText" className={statusText().cls}>{statusText().text}</strong>
              </p>
            </div>

            <div className="btn-group">
              <button
                id="onlineBtn"
                className="btn btn-success btn-sm"
                onClick={() => setStatus("ONLINE")}
                disabled={!!currentTrip || (driverData && (driverData.onBreak || driverData.onlineStatus === "ONLINE"))}
              >
                Go Online
              </button>
              <button
                id="offlineBtn"
                className="btn btn-danger btn-sm"
                onClick={() => setStatus("OFFLINE")}
                disabled={!!currentTrip || (driverData && (driverData.onBreak || driverData.onlineStatus === "OFFLINE"))}
              >
                Go Offline
              </button>
            </div>
          </div>
        </div>

        {/* BREAK CARD */}
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <span id="breakText">{breakText()}</span>
            <button
              id="breakBtn"
              className="btn btn-warning btn-sm"
              onClick={toggleBreak}
              disabled={!!currentTrip || (driverData && driverData.onlineStatus === "OFFLINE")}
            >
              {driverData && driverData.onBreak ? "End Break" : "Take Break"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card text-center p-3">
              <h6>Today Earnings</h6>
              <h3>₹ <span id="earnings">{driverData ? driverData.todayEarnings : 0}</span></h3>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center p-3">
              <h6>Total Trips</h6>
              <h3><span id="trips">{driverData ? driverData.totalTrips : 0}</span></h3>
            </div>
          </div>
        </div>

        {/* CURRENT TRIP CARD */}
        <div className={`card shadow-lg mt-4 ${!currentTrip ? "d-none" : ""}`} id="tripCard">
          <div className="card-header bg-warning fw-bold">Trip Request</div>
          <div className="card-body">
            <p><strong>Passenger:</strong> <span id="pName">{currentTrip?.passengerName}</span></p>
            <p><strong>Pickup:</strong> <span id="pickup">{currentTrip?.pickup}</span></p>
            <p><strong>Drop:</strong> <span id="drop">{currentTrip?.dropLocation}</span></p>
            <p><strong>Fare:</strong> ₹ <span id="fare">{currentTrip?.fare}</span></p>

            <div className={`d-flex gap-2 mt-3 ${currentTrip?.status === "ASSIGNED" ? "" : "d-none"}`} id="acceptRejectBtns">
              <button className="btn btn-success w-100" onClick={acceptTrip}>Accept</button>
              <button className="btn btn-danger w-100" onClick={rejectTrip}>Reject</button>
            </div>

            <button className={`btn btn-primary w-100 mt-3 ${currentTrip?.status === "ACCEPTED" ? "" : "d-none"}`} id="startBtn" onClick={startTrip}>
              Start Trip
            </button>

            <button className={`btn btn-danger w-100 mt-3 ${currentTrip?.status === "STARTED" ? "" : "d-none"}`} id="completeBtn" onClick={completeTrip}>
              Complete Trip
            </button>
          </div>
        </div>

        {/* TABS: Dashboard / History */}
        <ul className="nav nav-tabs mt-5" role="tablist">
          <li className="nav-item">
            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#dashboardTab">Dashboard</button>
          </li>
          <li className="nav-item">
            <button id="historyTabBtn" className="nav-link" data-bs-toggle="tab" data-bs-target="#historyTab" onClick={loadDriverHistory}>
              Trip History
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane fade show active" id="dashboardTab">
            {/* already shown above */}
          </div>

          <div className="tab-pane fade" id="historyTab">
            <div className="card mt-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="summary d-flex gap-3">
                  <div className="box">Trips: {tripHistory.length}</div>
                  <div className="box">Earnings: ₹ {tripHistory.reduce((s, t) => s + (t.fare || 0), 0)}</div>
                </div>
                <div className="search">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Passenger or Place..."
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                  />
                </div>
              </div>

              {loadingHistory ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Passenger</th>
                          <th>Pickup</th>
                          <th>Drop</th>
                          <th>Fare</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="tripBody">
                        {filteredHistory.length === 0 ? (
                          <tr><td colSpan="6" className="text-center">No trips yet 🚖</td></tr>
                        ) : (
                          filteredHistory.map((t) => (
                            <tr key={t.id}>
                              <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}</td>
                              <td>{t.passengerName}</td>
                              <td>{t.pickup}</td>
                              <td>{t.dropLocation}</td>
                              <td>₹ {t.fare}</td>
                              <td>{t.status}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
