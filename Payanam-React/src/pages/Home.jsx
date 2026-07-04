import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/home.css";
import { toast } from "react-toastify";

const Home = () => {
  const mapRef = useRef(null);

  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const [tripDistance, setTripDistance] = useState(0);
  const [tripDuration, setTripDuration] = useState(0);
  const [tripFare, setTripFare] = useState(0);

  const BASE_FARE = 40;
  const RATE_PER_KM = 12;

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);

  const activeInputRef = useRef(activeInput);
  const pickupCoordsRef = useRef(pickupCoords);
  const dropCoordsRef = useRef(dropCoords);

  useEffect(() => { activeInputRef.current = activeInput; }, [activeInput]);
  useEffect(() => { pickupCoordsRef.current = pickupCoords; }, [pickupCoords]);
  useEffect(() => { dropCoordsRef.current = dropCoords; }, [dropCoords]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([13.0827, 80.2707], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
      mapRef.current.on("click", onMapClick);
    }
  }, []);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Selected Location";
    } catch {
      return "Selected Location";
    }
  };

  const onMapClick = async (e) => {
    const currentActiveInput = activeInputRef.current;
    if (!currentActiveInput) return;

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const address = await getAddressFromLatLng(lat, lng);

    if (currentActiveInput === "pickup") {
      setPickupCoords([lat, lng]);
      setPickup(address);
      L.marker(e.latlng).addTo(mapRef.current).bindPopup("📍 Pickup").openPopup();
      setActiveInput(null);
    } else if (currentActiveInput === "drop") {
      setDropCoords([lat, lng]);
      setDrop(address);
      L.marker(e.latlng).addTo(mapRef.current).bindPopup("🏁 Drop").openPopup();
      setActiveInput(null);
      if (pickupCoordsRef.current) drawRoute([lat, lng]);
    }
  };

  const drawRoute = async (newDropCoords) => {
    const pCoords = pickupCoordsRef.current;
    const dCoords = newDropCoords || dropCoordsRef.current;
    if (!pCoords || !dCoords) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    const route = data.routes[0];

    setTripDistance(route.distance / 1000);
    setTripDuration(route.duration / 60);
    setTripFare(BASE_FARE + (route.distance / 1000) * RATE_PER_KM);

    const routeLayer = L.geoJSON(route.geometry).addTo(mapRef.current);
    mapRef.current.fitBounds(routeLayer.getBounds());
  };

  // 🚕 BOOK TRIP API
  const bookTrip = async () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    // ✅ Block booking if not logged in
    if (!token || !name) {
      toast.error("⚠️ Please login before booking a ride");
      navigate("/login");   // use navigate instead of window.location.href
      return;
    }

    if (!pickupCoords || !dropCoords) {
      toast.error("Please select pickup and drop locations on map");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/trip/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          pickupLat: pickupCoords[0],
          pickupLng: pickupCoords[1],
          dropLat: dropCoords[0],
          dropLng: dropCoords[1],
          pickup,
          dropLocation: drop,
          passengerName: name,
        }),
      });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        toast.error("Session expired. Please login again.");
        navigate("/login");   // redirect with navigate
        return;
      }
      throw new Error("Booking failed");
    }

    const trip = await res.json();
    navigate(`/tracking?tripId=${trip.id}`);   // redirect to tracking page
  } catch (err) {
    console.error(err);
    toast.error("⚠️ Booking failed. Please login again.");
    localStorage.clear();
    navigate("/login");   // redirect with navigate
  }
};

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img
          className="hero-img"
          src="assets/1280116-3840x2160-desktop-4k-taxi-wallpaper-photo.jpg"
          alt="Taxi background"
        />
        <div className="hero-content">
          <h3 className="hero-quote">Plan, book, and ride</h3>
          <h3 className="hero-quote sub">with ease</h3>
        </div>

        {/* Destination Form */}
        <div className="dest-form">
          <div className="input-wrapper">
            <i className="fa-solid fa-location-dot"></i>
            <input
              className="des-input"
              type="text"
              placeholder="Current Location"
              value={pickup}
              readOnly
              onClick={() => {
                setActiveInput("pickup");
                setTimeout(() => mapRef.current.invalidateSize(), 200);
              }}
            />
          </div>
          <div className="input-wrapper">
            <i className="fa-solid fa-flag-checkered"></i>
            <input
              className="des-input"
              type="text"
              placeholder="Destination"
              value={drop}
              readOnly
              onClick={() => {
                setActiveInput("drop");
                setTimeout(() => mapRef.current.invalidateSize(), 200);
              }}
            />
          </div>
        </div>
      </section>
      <br /><br />

      {/* Map */}
      <div
        className="map-wrapper"
        style={{
          display: activeInput ? "block" : "none",
          position: "relative",
          width: "70%",
          margin: "20px auto",
        }}
      >
        <button
          type="button"
          className="map-close-btn"
          onClick={() => setActiveInput(null)}
          aria-label="Close map"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 1000,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
            fontSize: "16px",
            lineHeight: "32px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <div id="map" className="map" style={{ height: "400px", width: "100%" }}></div>
      </div>

      {/* Fare Card */}
      {pickup && drop && (
        <div id="fareCard" className="container-md mt-3">
          <div className="card shadow-lg p-3 mt-3">
            <h5 className="text-warning">🚖 Ride Details</h5>
            <p><strong>Pickup:</strong> {pickup}</p>
            <p><strong>Drop:</strong> {drop}</p>
            <hr />
            <p><strong>Distance:</strong> {tripDistance.toFixed(2)} km</p>
            <p><strong>Estimated Time:</strong> {tripDuration.toFixed(0)} mins</p>
            <hr />
            <p><strong>Base Fare:</strong> ₹ {BASE_FARE}</p>
            <p><strong>Rate:</strong> ₹ {RATE_PER_KM} / km</p>
            <h4 className="text-success">Total Fare: ₹ {tripFare.toFixed(0)}</h4>
            <button className="btn btn-warning w-100 mt-3" onClick={bookTrip}>
              Book Ride 🚕
            </button>
          </div>
        </div>
      )}


      {/* Ad Section */}
      <div className="container-sm">
        <div className="ad-payanam">
          <h2>First Ride Hailing Company</h2>
          <p>Payanam is the first platform to give Drivers break during the Login Time</p>
        </div>

        <div className="ad-banner">
          <h3>Payanam For Everyone</h3>
          <div className="row ad-banner-row">
            <div className="col">
              <img className="vl-img" src="assets/3725835.jpg" alt="" />
              <h3>Local or outstation</h3>
              <p>Book a ride for daily travels or explore destinations beyond the city.</p>
            </div>
            <div className="col">
              <img className="vl-img" src="assets/taxi-3.jpeg" alt="" />
              <h3>Anytime you need</h3>
              <p>24×7 availability — because your plans don’t wait, and neither do we.</p>
            </div>
            <div className="col">
              <img className="vl-img" src="assets/taxi-4.jpeg" alt="" />
              <h3>Fits every pocket</h3>
              <p>Choose from rides that suit your budget — economical or premium.</p>
            </div>
          </div>
        </div>

        <div className="ad-banner-two">
          <h2>Download Our Apps For Best Experience</h2>
          <div className="row-app">
            <div className="col-app">
              <div className="app-Logo bg-warning">P</div>
              <div>
                <h5>Payanam</h5>
                <p>Book Cabs, Bikes, Trucks for house shifting, insurance, etc...</p>
              </div>
            </div>
            <div className="col-app">
              <div className="app-Logo bg-warning">P</div>
              <div>
                <h5>Payanam Driver</h5>
                <p>Register as a driver to take rides, see earnings and incentives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;