// src/pages/Tracking.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/tracking.css";

const Tracking = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map("tracking-map").setView([13.0827, 80.2707], 12); // Chennai coords

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      // Example markers
      const pickupMarker = L.marker([13.0827, 80.2707]).addTo(mapRef.current);
      pickupMarker.bindPopup("Pickup: Chennai Central").openPopup();

      const dropMarker = L.marker([12.9941, 80.1709]).addTo(mapRef.current);
      dropMarker.bindPopup("Drop: Chennai Airport");
    }
  }, []);

  return (
    <section className="tracking-section container mt-5 pt-5">
      <h2 className="fw-bold mb-4 text-center">Live Ride Tracking</h2>
      <div id="tracking-map" className="tracking-map"></div>
    </section>
  );
};

export default Tracking;
