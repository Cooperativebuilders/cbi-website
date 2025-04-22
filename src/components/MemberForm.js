// src/components/MemberForm.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const solariRoles = [
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

const provinces = {
  Ulster: [
    "Cavan",
    "Donegal",
    "Monaghan",
    "Antrim",
    "Armagh",
    "Derry",
    "Down",
    "Fermanagh",
    "Tyrone",
  ],
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

const MemberForm = () => {
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    firstName: "",
    profession: "",
    yearsExperience: 0,
    specialisations: "",
    licences: "",
    tools: "",
    location: "All Ireland",
    county: "",
    propertyType: "Residential",
    projectType: [],
    buyInFrom: 0,
    buyInTo: 50000,
    availability: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "projectType") {
      const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setFormData((prev) => ({ ...prev, projectType: values }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number" || type === "range" ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      // write into "profiles" collection, merging with any existing data
      await setDoc(
        doc(db, "profiles", user.uid),
        {
          ...formData,
          email: user.email,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
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
        {solariRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <input
        name="yearsExperience"
        type="number"
        placeholder="Years Experience"
        value={formData.yearsExperience}
        onChange={handleChange}
        className="w-full p-2 border rounded"
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

      <select
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        {["All Ireland", ...Object.keys(provinces)].map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>

      {formData.location !== "All Ireland" && (
        <select
          name="county"
          value={formData.county}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select County</option>
          {provinces[formData.location].map((cty) => (
            <option key={cty} value={cty}>
              {cty}
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
        <option value="All Types">All Types</option>
      </select>

      <select
        name="projectType"
        value={formData.projectType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Structure</option>
        <option value="Build to Sell">Build to Sell</option>
        <option value="Build to Let">Build to Let</option>
        <option value="All Types">All Types</option>
      </select>

      <label className="block text-sm font-medium text-gray-700">
        Max Buy-In (€{formData.buyInTo.toLocaleString()})
      </label>
      <input
        type="range"
        name="buyInTo"
        min={0}
        max={1000000}
        step={5000}
        value={formData.buyInTo}
        onChange={handleChange}
        className="w-full"
      />

      <label className="block text-sm font-medium text-gray-700">
        Available for my next project from...
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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Save Tile
      </button>
    </form>
  );
};

export default MemberForm;
