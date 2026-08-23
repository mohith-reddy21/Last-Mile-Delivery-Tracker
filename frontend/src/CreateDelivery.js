import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateDelivery() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/deliveries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create delivery");
      }

      setMessage("Delivery created successfully!");

      setForm({
        pickupAddress: "",
        deliveryAddress: "",
        packageDetails: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h1>Create Delivery</h1>
      <p>Enter the delivery details.</p>

      <form onSubmit={handleSubmit}>
        <label>Pickup Address</label>
        <input
          type="text"
          name="pickupAddress"
          value={form.pickupAddress}
          onChange={handleChange}
          placeholder="Example: VIT University, Vellore"
          required
        />

        <label>Delivery Address</label>
        <input
          type="text"
          name="deliveryAddress"
          value={form.deliveryAddress}
          onChange={handleChange}
          placeholder="Example: Chennai Central"
          required
        />

        <label>Package Details</label>
        <input
          type="text"
          name="packageDetails"
          value={form.packageDetails}
          onChange={handleChange}
          placeholder="Example: Documents"
          required
        />

        <button className="primary-button" type="submit">
          Create Delivery
        </button>
      </form>

      {message && <div className="success-message">{message}</div>}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default CreateDelivery;