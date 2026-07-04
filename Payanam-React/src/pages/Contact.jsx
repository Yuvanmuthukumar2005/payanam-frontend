// src/pages/Contact.jsx
import React, { useState } from "react";
import "../styles/contact.css";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendContact = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      // Adjust this endpoint to match your backend's actual contact route.
      const response = await fetch("http://localhost:8080/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", subject: "", email: "", message: "" });
      toast.success("Message sent successfully, We will get back you Soon..!")
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="contact-section container text-center mt-5 pt-5">
      <h2 className="fw-bold mb-4">Contact Us</h2>
      <p className="lead mb-5">We’d love to hear from you. Reach out anytime!</p>

      {/* Contact Form */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <form
            id="contactForm"
            className="p-4 shadow rounded bg-light text-start"
            onSubmit={sendContact}
          >
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                placeholder="Type your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-success mt-3 mb-0">
                ✅ Message sent! We'll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-danger mt-3 mb-0">⚠️ {errorMsg}</p>
            )}
          </form>
        </div>
      </div>

      {/* Info Cards */}
      <div className="row justify-content-center">
        {/* Phone */}
        <div className="col-md-4 mb-4">
          <i className="fa-solid fa-phone fa-2x text-warning mb-3"></i>
          <h5>Phone</h5>
          <p>+91 90030 49782</p>
        </div>

        {/* Email */}
        <div className="col-md-4 mb-4">
          <i className="fa-solid fa-envelope fa-2x text-warning mb-3"></i>
          <h5>Email</h5>
          <p>support@payanam.com</p>
        </div>

        {/* Location */}
        <div className="col-md-4 mb-4">
          <i className="fa-solid fa-location-dot fa-2x text-warning mb-3"></i>
          <h5>Location</h5>
          <p>Chennai, India</p>
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-5">
        <h4 className="fw-bold">Our Location</h4>
        <iframe
          title="Payanam Location"
          src="https://www.google.com/maps?q=Chennai,India&output=embed"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </div>

      {/* Social Icons */}
      <div className="social-icons mt-4">
        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
        <a href="#"><i className="fa-brands fa-instagram"></i></a>
        <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
        <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
      </div>
    </section>
  );
};

export default Contact;
