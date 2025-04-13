// src/components/MemberForm.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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
    propertyType: "",
    projectType: "",
    buyInFrom: "",
    buyInTo: "",
    availability: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      <h2 className="text-xl font-bold text-blue-700">Your Member Tile</h2>
      {[
        ["firstName", "First Name"],
        ["profession", "Profession"],
        ["yearsExperience", "Years Experience"],
        ["specialisations", "Specialisations"],
        ["licences", "Licences & Tickets"],
        ["tools", "Tools & Equipment"],
        ["location", "Preferred Project Location"],
        ["propertyType", "Property Type"],
        ["projectType", "Project Type"],
        ["availability", "Availability (Date)"],
      ].map(([name, label]) => (
        <input
          key={name}
          name={name}
          placeholder={label}
          value={formData[name]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      ))}

      <div className="flex space-x-2">
        <input
          name="buyInFrom"
          placeholder="Buy-in From (€)"
          type="number"
          value={formData.buyInFrom}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        />
        <input
          name="buyInTo"
          placeholder="Buy-in To (€)"
          type="number"
          value={formData.buyInTo}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        />
      </div>

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
