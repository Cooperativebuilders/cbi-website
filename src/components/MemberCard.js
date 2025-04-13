// src/components/MemberCard.js
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const MemberCard = () => {
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    firstName: "",
    profession: "",
    experience: "",
    specialisations: "",
    licences: "",
    tools: "",
    location: "",
    propertyType: "Residential",
    projectType: "B2S",
    buyInMin: "",
    buyInMax: "",
    availability: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!user) return alert("Not logged in");

    const userRef = doc(db, "members", user.uid);
    await setDoc(userRef, { ...formData, email: user.email }, { merge: true });
    alert("Profile saved successfully!");
  };

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-md mt-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Your Member Profile
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={formData.profession}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="specialisations"
          placeholder="Specialisations (if any)"
          value={formData.specialisations}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="licences"
          placeholder="Licences & Tickets (if any)"
          value={formData.licences}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="tools"
          placeholder="Tools, Equipment & Machinery"
          value={formData.tools}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="location"
          placeholder="Preferred project Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="B2S">Build to Sell (B2S)</option>
          <option value="B2L">Build to Let (B2L)</option>
        </select>

        <div className="flex gap-4">
          <input
            type="number"
            name="buyInMin"
            placeholder="Buy-in from (€)"
            value={formData.buyInMin}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            name="buyInMax"
            placeholder="Buy-in to (€)"
            value={formData.buyInMax}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <input
          type="date"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <button
          onClick={saveProfile}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
