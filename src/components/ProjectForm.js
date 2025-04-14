// src/components/ProjectForm.js
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const ProjectForm = () => {
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    location: "",
    propertyType: "Residential",
    projectType: "Build to Sell",
    startDate: "",
    budget: "",
    buyIn: "",
    notes: "",
    openToPassive: "Yes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in.");

    const projectId = uuidv4();
    try {
      await setDoc(doc(db, "projects", projectId), {
        ...formData,
        budget: parseInt(formData.budget),
        buyIn: parseInt(formData.buyIn),
        submittedBy: user.email,
        createdAt: new Date().toISOString(),
        participants: [],
      });
      alert("✅ Project submitted!");
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("❌ Error submitting project.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold text-blue-700">Submit a Project</h2>

      <input
        name="location"
        placeholder="Project Location"
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
      >
        <option>Residential</option>
        <option>Commercial</option>
        <option>Industrial</option>
      </select>

      <select
        name="projectType"
        value={formData.projectType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option>Build to Sell</option>
        <option>Build to Let</option>
      </select>

      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="budget"
        placeholder="Project Budget (€)"
        type="number"
        value={formData.budget}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="buyIn"
        placeholder="Buy-in Amount (€)"
        type="number"
        value={formData.buyIn}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <select
        name="openToPassive"
        value={formData.openToPassive}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Yes">Open to Passive Investors?</option>
        <option value="No">Not Open to Passive Investors</option>
      </select>

      <textarea
        name="notes"
        placeholder="Additional notes (max 500 characters)"
        value={formData.notes}
        onChange={handleChange}
        maxLength={500}
        className="w-full p-2 border rounded"
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
