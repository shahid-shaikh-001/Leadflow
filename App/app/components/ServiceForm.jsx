"use client";

import { useState } from "react";

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    serviceType: "SERVICE_1",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setStatus(`❌ ${data.message}`);
        return;
      }

      setStatus(
        `✅ Lead created successfully. Assigned providers: ${data.data.assignedProviders.join(
          ", "
        )}`
      );

      setFormData({
        name: "",
        phone: "",
        city: "",
        serviceType: "SERVICE_1",
        description: "",
      });
    } catch (err) {
      setStatus("❌ Something went wrong while submitting the lead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card formCard" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter customer name"
        />
      </div>

      <div className="formGroup">
        <label>Phone Number</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10 digit phone number"
          maxLength="10"
        />
      </div>

      <div className="formGroup">
        <label>City</label>
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
        />
      </div>

      <div className="formGroup">
        <label>Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
        >
          <option value="SERVICE_1">Service 1</option>
          <option value="SERVICE_2">Service 2</option>
          <option value="SERVICE_3">Service 3</option>
        </select>
      </div>

      <div className="formGroup">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the service requirement"
        />
      </div>

      <button className="fullBtn" disabled={loading}>
        {loading ? "Submitting..." : "Submit Service Request"}
      </button>

      {status && <div className="status">{status}</div>}
    </form>
  );
}