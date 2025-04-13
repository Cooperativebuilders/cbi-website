// src/components/MemberForm.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const professionsList = [
  "Carpenter",
  "Electrician",
  "Plumber-RGI",
  "Tiler",
  "Bricklayer",
  "Groundworker",
  "Plasterer",
  "Welder",
  "Landscaper",
  "Roofer",
  "Architect",
  "Engineer",
  "Surveyor",
  "PM",
  "Skilled Labourer",
  "Supplier",
];

const MemberForm = () => {
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    firstName: "",
    profession: "",
    yearsExperience: "",
    specialisations: "",
    licences: "",
    tools: "",
    location: "",
    propertyType: "Residential",
    projectType: "Build to Sell",
    buyIn: 5000,
    availability: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSliderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      buyIn: parseInt(e.target.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first.");
    try {
      await setDoc(doc(db, "profiles", user.uid), {
        ...formData,
        email: user.email,
      });
      alert("✅ Profile saved!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("❌ Error saving profile.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-700 mb-4">Your Member Tile</h2>

      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <select
        name="profession"
        value={formData.profession}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Profession</option>
        {professionsList.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <input
        name="yearsExperience"
        placeholder="Years Experience"
        type="number"
        value={formData.yearsExperience}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="specialisations"
        placeholder="Specialisations (if any)"
        value={formData.specialisations}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="licences"
        placeholder="Licences & Tickets (if any)"
        value={formData.licences}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="tools"
        placeholder="Tools, Equipment & Machinery"
        value={formData.tools}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="location"
        placeholder="Preferred project Location"
        value={formData.location}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <select
        name="propertyType"
        value={formData.propertyType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
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
      >
        <option value="Build to Sell">Build to Sell</option>
        <option value="Build to Let">Build to Let</option>
      </select>

      <label className="block text-sm font-medium text-gray-700">
        Buy-in Amount (€{formData.buyIn.toLocaleString()})
      </label>
      <input
        type="range"
        name="buyIn"
        min={0}
        max={1000000}
        step={5000}
        value={formData.buyIn}
        onChange={handleSliderChange}
        className="w-full"
      />

      <label className="block text-sm font-medium text-gray-700">
        Start Date
      </label>
      <input
        type="date"
        name="availability"
        value={formData.availability}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save Tile
      </button>
    </form>
  );
};

export default MemberForm;
