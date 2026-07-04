// src/pages/UserHistory.jsx
import React from "react";
import "../styles/user-history.css";

const UserHistory = () => {
  return (
    <section className="user-history container mt-5 pt-5">
      <h2 className="fw-bold mb-4 text-center">My Ride History</h2>

      <div className="card shadow-sm p-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Date</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Fare</th>
              <th>Driver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#USER201</td>
              <td>2026-06-20</td>
              <td>Chennai Central</td>
              <td>Airport</td>
              <td>₹ 650</td>
              <td>Ramesh</td>
              <td><span className="badge bg-success">Completed</span></td>
            </tr>
            <tr>
              <td>#USER202</td>
              <td>2026-06-22</td>
              <td>Anna Nagar</td>
              <td>Marina Beach</td>
              <td>₹ 420</td>
              <td>Kumar</td>
              <td><span className="badge bg-success">Completed</span></td>
            </tr>
            <tr>
              <td>#USER203</td>
              <td>2026-06-25</td>
              <td>Velachery</td>
              <td>Tambaram</td>
              <td>₹ 300</td>
              <td>Suresh</td>
              <td><span className="badge bg-danger">Cancelled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserHistory;
