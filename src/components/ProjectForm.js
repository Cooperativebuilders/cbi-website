// src/components/ProjectForm.js
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const ProjectForm = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    location: "",
    propertyType: "Residential",
    projectType: "Build to Sell",
    startDate: "",
    budget: "",
    buyIn: "",
    passiveOpen: "No",
    notes: "",
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
    if (!user) return alert("Please log in first.");

    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        submittedBy: user.email,
        timestamp: Timestamp.now(),
      });
      alert("✅ Project submitted!");
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("❌ Error submitting project.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Dashboard Nav */}
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
        <Link to="/members" className="text-sm text-blue-500 hover:underline">
          View All Members
        </Link>
      </nav>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Submit a Project
        </h2>

        <input
          name="location"
          placeholder="Project Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Build to Sell">Build to Sell</option>
          <option value="Build to Let">Build to Let</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          name="budget"
          placeholder="Project Budget (€)"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          name="buyIn"
          placeholder="Buy-in Amount (€)"
          value={formData.buyIn}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <select
          name="passiveOpen"
          value={formData.passiveOpen}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Yes">Open to Passive Investors? Yes</option>
          <option value="No">Open to Passive Investors? No</option>
        </select>

        <textarea
          name="notes"
          placeholder="Additional notes (max 500 characters)"
          value={formData.notes}
          onChange={handleChange}
          maxLength={500}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
