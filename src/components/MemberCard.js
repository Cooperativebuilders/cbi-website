// src/components/MemberCard.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const MemberCard = () => {
  const [occupation, setOccupation] = useState("");
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [locations, setLocations] = useState("");
  const [readiness, setReadiness] = useState("Currently seeking");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const ref = doc(db, "members", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setOccupation(data.occupation || "");
        setExperience(data.experience || "");
        setSpecializations(data.specializations || "");
        setLocations(data.locations || "");
        setReadiness(data.readiness || "Currently seeking");
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const ref = doc(db, "members", uid);
      await setDoc(ref, {
        occupation,
        experience,
        specializations,
        locations,
        readiness,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || "",
        updatedAt: new Date().toISOString(),
      });
      setStatus("✅ Saved!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Error saving member data:", err);
      setStatus("❌ Error saving.");
    }
  };

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-md mt-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Your Member Profile
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Occupation (e.g. Plumber, Investor)"
          className="w-full p-3 border rounded"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Years of Experience"
          className="w-full p-3 border rounded"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <input
          type="text"
          placeholder="Specializations (e.g. Underfloor Heating, Planning, 1st Fix)"
          className="w-full p-3 border rounded"
          value={specializations}
          onChange={(e) => setSpecializations(e.target.value)}
        />

        <input
          type="text"
          placeholder="Preferred Project Locations (e.g. Dublin, Cork, remote)"
          className="w-full p-3 border rounded"
          value={locations}
          onChange={(e) => setLocations(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded"
          value={readiness}
          onChange={(e) => setReadiness(e.target.value)}
        >
          <option value="Currently seeking">Currently seeking projects</option>
          <option value="Currently developing">Currently developing</option>
          <option value="Not ready">Not ready</option>
        </select>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>

        {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
      </div>
    </div>
  );
};

export default MemberCard;
