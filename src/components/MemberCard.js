// src/components/MemberCard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const MemberCard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    occupation: "",
    experience: "",
    specializations: "",
    locations: "",
    readiness: "Currently seeking",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "profiles", user.uid);
      await setDoc(docRef, {
        ...profile,
        email: user.email,
        name: user.displayName || "",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-md mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Your Member Profile
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Logged in as <strong>{user.email}</strong>
      </p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Occupation (e.g. Plumber, Investor)"
          className="w-full p-3 border rounded"
          value={profile.occupation}
          onChange={(e) => handleChange("occupation", e.target.value)}
        />

        <input
          type="number"
          placeholder="Years of Experience"
          className="w-full p-3 border rounded"
          value={profile.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
        />

        <input
          type="text"
          placeholder="Specializations (e.g. Underfloor Heating)"
          className="w-full p-3 border rounded"
          value={profile.specializations}
          onChange={(e) => handleChange("specializations", e.target.value)}
        />

        <input
          type="text"
          placeholder="Preferred Project Locations (e.g. Dublin, Cork)"
          className="w-full p-3 border rounded"
          value={profile.locations}
          onChange={(e) => handleChange("locations", e.target.value)}
        />

        <select
          className="w-full p-3 border rounded"
          value={profile.readiness}
          onChange={(e) => handleChange("readiness", e.target.value)}
        >
          <option value="Currently seeking">Currently seeking projects</option>
          <option value="Currently developing">Currently developing</option>
          <option value="Not ready">Not ready</option>
        </select>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>

        {saved && (
          <p className="text-green-600 text-center mt-2">✅ Profile saved!</p>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
