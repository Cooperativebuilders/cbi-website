// src/components/ProjectForm.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";

const ProjectForm = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    location: "",
    propertyType: "Residential",
    projectType: "Build to Sell",
    budget: "",
    startDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first.");

    try {
      const id = uuidv4();
      await setDoc(doc(db, "projects", id), {
        ...formData,
        budget: parseInt(formData.budget, 10),
        submittedBy: user.email,
        createdAt: new Date().toISOString(),
      });
      alert("✅ Project submitted!");
      setFormData({
        location: "",
        propertyType: "Residential",
        projectType: "Build to Sell",
        budget: "",
        startDate: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error saving project:", err);
      alert("❌ Error saving project.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700 mb-4">Submit a Project</h2>

      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <select
        name="propertyType"
        value={formData.propertyType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
        <option value="Industrial">Industrial</option>
      </select>

      <select
        name="projectType"
        value={formData.projectType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="Build to Sell">Build to Sell</option>
        <option value="Build to Let">Build to Let</option>
      </select>

      <input
        name="budget"
        type="number"
        placeholder="Budget (€)"
        value={formData.budget}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="notes"
        placeholder="Additional notes (max 500 characters)"
        value={formData.notes}
        onChange={handleChange}
        maxLength={500}
        className="w-full p-2 border rounded"
        rows={4}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit Project
      </button>
    </form>
  );
};

export default ProjectForm;
