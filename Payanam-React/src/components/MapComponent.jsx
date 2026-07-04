// src/components/MapComponent.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([13.0827, 80.2707], 13); // Chennai
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);
    }
  }, []);

  return (
    <div
      id="map"
      style={{ height: "400px", width: "70%", borderRadius: "12px", display: "none" }}
    ></div>
  );
};

export default MapComponent;
