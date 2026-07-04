// src/pages/About.jsx
import React from "react";
import "../styles/about.css";

const About = () => {
  return (
    <section className="about-section container text-center mt-5 pt-5">
      <h2 className="fw-bold mb-4">About Payanam</h2>
      <p className="lead mb-5">
        We’re redefining how India travels — simple, smart, and stress-free.
      </p>

      <div className="row align-items-center">
        {/* Images */}
        <div className="col-md-4 about-imgs">
          <img src="/assets/17 .jpeg" className="img-fluid rounded shadow mb-3" alt="About Payanam" />
          <img src="/assets/3725835.jpg" className="img-fluid rounded shadow mb-3" alt="About Payanam" />
          <img src="/assets/_DSC6982.jpg" className="img-fluid rounded shadow" alt="About Payanam" />
        </div>

        {/* Text Content */}
        <div className="col-md-8 text-start">
          <h4 className="fw-bold">Our Story</h4>
          <p>
            The idea for Payanam was born from a simple real-life experience.
            One day, I noticed that many cab drivers skip their meals or avoid taking breaks during work hours.
            Curious, I spoke to a driver and asked why. He replied:
          </p>
          <h4>“If we go offline, we don’t get our incentives.”</h4>
          <p>
            That moment revealed a bigger issue — drivers were sacrificing their health just to stay online
            and earn incentives. This inspired the creation of Payanam, a platform designed to support drivers’ well-being while keeping their earnings steady.
          </p>

          <h4 className="fw-bold">Our Mission</h4>
          <p>
            To create a driver-first ride platform that understands their challenges and provides a fair system
            where they can earn incentives and still take healthy breaks without losing opportunities.
          </p>

          <h4 className="fw-bold">Our Vision</h4>
          <p>
            To build a future where technology doesn’t just connect rides, but also cares for the people who drive them.
            Payanam aims to become a trusted companion for drivers, helping them maintain a balance between work and wellness.
          </p>

          <h4 className="fw-bold mt-4">What Makes Payanam Different</h4>
          <ul>
            <li>🚘 Drivers can take breaks without logging out.</li>
            <li>⏱ They won’t receive ride requests during break time.</li>
            <li>💰 Incentive eligibility continues if they stay online and active for the required hours.</li>
            <li>❤️ Designed with drivers’ comfort and health in mind.</li>
            <li>🚗 Reliable Rides, Every Time</li>
            <li>💰 Fair Pricing for Riders and Drivers</li>
            <li>🌏 Sustainability through Smarter Routes</li>
          </ul>

          <p>
            At Payanam, we believe that when drivers are cared for, every journey becomes smoother, safer, and happier — for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
