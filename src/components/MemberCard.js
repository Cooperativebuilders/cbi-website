// src/components/MemberCard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const MemberCard = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const docRef = doc(db, "members", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "members", user.uid), formData);
      alert("✅ Profile saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-md mt-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Your Member Profile
      </h2>

      <div className="space-y-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="profession"
          placeholder="Profession (e.g. Plumber, Investor)"
          value={formData.profession}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="specialisations"
          placeholder="Specialisations (if any)"
          value={formData.specialisations}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="licences"
          placeholder="Licences & Tickets (if any)"
          value={formData.licences}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="tools"
          placeholder="Tools, Equipment & Machinery"
          value={formData.tools}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="location"
          placeholder="Preferred Project Location"
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

        <div className="flex space-x-2">
          <input
            name="buyInMin"
            placeholder="Buy-in € Min"
            value={formData.buyInMin}
            onChange={handleChange}
            className="w-1/2 p-3 border rounded"
          />
          <input
            name="buyInMax"
            placeholder="Buy-in € Max"
            value={formData.buyInMax}
            onChange={handleChange}
            className="w-1/2 p-3 border rounded"
          />
        </div>

        <input
          type="date"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
      </div>

      <button
        onClick={saveProfile}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Save Profile
      </button>
    </div>
  );
};

export default MemberCard;
