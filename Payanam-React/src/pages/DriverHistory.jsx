// src/pages/DriverHistory.jsx
import React from "react";
import "../styles/driver-history.css";

const DriverHistory = () => {
  return (
    <section className="driver-history container mt-5 pt-5">
      <h2 className="fw-bold mb-4 text-center">Driver Ride History</h2>

      <div className="card shadow-sm p-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Date</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#TRIP090</td>
              <td>2026-06-25</td>
              <td>Chennai Central</td>
              <td>Airport</td>
              <td>₹ 650</td>
              <td><span className="badge bg-success">Completed</span></td>
            </tr>
            <tr>
              <td>#TRIP091</td>
              <td>2026-06-26</td>
              <td>Anna Nagar</td>
              <td>Marina Beach</td>
              <td>₹ 420</td>
              <td><span className="badge bg-success">Completed</span></td>
            </tr>
            <tr>
              <td>#TRIP092</td>
              <td>2026-06-27</td>
              <td>Velachery</td>
              <td>Tambaram</td>
              <td>₹ 300</td>
              <td><span className="badge bg-danger">Cancelled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DriverHistory;
