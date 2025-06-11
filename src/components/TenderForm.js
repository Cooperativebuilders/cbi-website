import React, { useState } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

function generateTenderCode() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TEND-${rand}`;
}

const TenderForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [asap, setAsap] = useState(false);

  const [formData, setFormData] = useState({
    title: "", // <-- Add this line
    description: "",
    type: "Labour Only",
    startDate: "",
    deadline: "",
    budget: "",
    contact: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first.");
      return;
    }
    try {
      const tenderCode = generateTenderCode();
      await setDoc(doc(db, "tenders", tenderCode), {
        tenderCode,
        title: formData.title, // <-- Add this line
        description: formData.description,
        type: formData.type,
        startDate: formData.startDate,
        deadline: formData.deadline,
        budget: parseInt(formData.budget, 10) || 0,
        contact: formData.contact,
        location: formData.location,
        postedBy: user.uid,
        postedByEmail: user.email,
        timestamp: Timestamp.now(),
      });
      alert("✅ Tender submitted!");
      navigate("/tenders");
    } catch (err) {
      console.error("Error submitting tender:", err);
      alert("❌ Error submitting tender.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
      </nav>
      {/* Page Descriptor */}
      <div className="max-w-xl mx-auto mb-6">
        <p className="text-gray-700 text-base bg-blue-50 border border-blue-100 rounded p-4">
          <strong>Find Sub-Contractors</strong> by posting contract offers here.
          Your offers will be available to view by all CBI Members until you remove
          it.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Submit a Tender
        </h2>
        <input
          name="title"
          placeholder="Tender Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <textarea
          name="description"
          placeholder="Tender Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Labour Only">Labour Only</option>
          <option value="Labour & Materials">Labour & Materials</option>
        </select>
        <label className="block mb-1 font-medium text-gray-700" htmlFor="startDate">
          Start Date
        </label>
        <div className="flex items-center mb-4">
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={asap ? "" : formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={asap}
            required={!asap}
            style={{ maxWidth: "200px" }}
          />
          <label className="ml-4 flex items-center">
            <input
              type="checkbox"
              checked={asap}
              onChange={(e) => {
                setAsap(e.target.checked);
                setFormData((prev) => ({
                  ...prev,
                  startDate: e.target.checked ? "ASAP" : "",
                }));
              }}
              className="mr-2"
            />
            ASAP
          </label>
        </div>
        <label className="block mb-1 font-medium text-gray-700" htmlFor="deadline">
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          name="budget"
          placeholder="Budget (€)"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          name="contact"
          placeholder="Contact Information"
          value={formData.contact}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Tender
        </button>
      </form>
    </div>
  );
};

export default TenderForm;