// src/components/MemberForm.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const provinces = {
  Ulster: ["Donegal", "Cavan", "Monaghan"],
  Munster: ["Clare", "Cork", "Kerry", "Limerick", "Tipperary", "Waterford"],
  Connacht: ["Galway", "Leitrim", "Mayo", "Roscommon", "Sligo"],
  Leinster: [
    "Carlow",
    "Dublin",
    "Kildare",
    "Kilkenny",
    "Laois",
    "Longford",
    "Louth",
    "Meath",
    "Offaly",
    "Westmeath",
    "Wexford",
    "Wicklow",
  ],
};

const professions = [
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
  "Project Manager",
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
    province: "All Ireland",
    county: "",
    propertyType: "Residential",
    projectType: [],
    buyIn: 0,
    availability: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        projectType: checked
          ? [...prev.projectType, value]
          : prev.projectType.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        required
      >
        <option value="">Select Profession</option>
        {professions.map((role) => (
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
        required
      />

      <input
        name="specialisations"
        placeholder="Specialisations"
        value={formData.specialisations}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="licences"
        placeholder="Licences & Tickets"
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

      {/* Province and County Dropdowns */}
      <select
        name="province"
        value={formData.province}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="All Ireland">All Ireland</option>
        {Object.keys(provinces).map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>

      {formData.province !== "All Ireland" && (
        <select
          name="county"
          value={formData.county}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select County</option>
          {provinces[formData.province].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

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

      <div className="text-gray-700 font-semibold">Project Type</div>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            value="Build to Sell"
            checked={formData.projectType.includes("Build to Sell")}
            onChange={handleChange}
          />
          <span className="ml-2">Build to Sell</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            value="Build to Let"
            checked={formData.projectType.includes("Build to Let")}
            onChange={handleChange}
          />
          <span className="ml-2">Build to Let</span>
        </label>
      </div>

      <label className="block font-semibold text-gray-700">
        Buy-in Range: €{formData.buyIn.toLocaleString()}
      </label>
      <input
        type="range"
        min={0}
        max={1000000}
        step={5000}
        value={formData.buyIn}
        name="buyIn"
        onChange={handleChange}
        className="w-full"
      />

      <input
        type="date"
        name="availability"
        value={formData.availability}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Start Date"
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
