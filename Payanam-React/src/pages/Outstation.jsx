// src/pages/Outstation.jsx
import React from "react";
import "../styles/outstation.css";

const Outstation = () => {
  return (
    <>
    <section className="outstation-section container text-center mt-5 pt-5">
      <h2 className="fw-bold mb-4">Outstation Rides</h2>
      <p className="lead mb-5">
        Book a ride for your daily travels or explore destinations beyond the city — all with a single tap.
      </p>
      <h1 className="fw-bold bg-warning">Coming Soon</h1>

      <br />
      <br />
      <div className="row justify-content-center">
        {/* Local or Outstation */}
        <div className="col-md-4 mb-4">
          <img src="/assets/3725835.jpg" className="img-fluid rounded shadow mb-3" alt="Local or Outstation" />
          <h4>Local or Outstation</h4>
          <p>
            Whether it’s a short trip within the city or a long journey outside, Payanam has you covered.
          </p>
        </div>

        {/* Anytime you need */}
        <div className="col-md-4 mb-4">
          <img src="/assets/7923562.jpg" className="img-fluid rounded shadow mb-3" alt="Anytime you need" />
          <h4>Anytime you need</h4>
          <p>
            24×7 availability — because your plans don’t wait, and neither do we.
          </p>
        </div>

        {/* Fits every pocket */}
        <div className="col-md-4 mb-4">
          <img src="/assets/taxi-4.jpeg" className="img-fluid rounded shadow mb-3" alt="Fits every pocket" />
          <h4>Fits every pocket</h4>
          <p>
            Choose from a range of rides that suit your budget — from economical daily trips to premium experiences.
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default Outstation;
