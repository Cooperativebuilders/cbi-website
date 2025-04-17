// src/components/ProjectForm.js
import React, { useState } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

// Utility to generate a code like "PROJ-ABCD12"
function generateProjectCode() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PROJ-${rand}`;
}

const ProjectForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate(); // so we can redirect after submit

  const [formData, setFormData] = useState({
    location: "",
    propertyType: "Residential",
    projectType: "Build to Sell",
    startDate: "",
    budget: "",
    buyIn: "",
    passiveOpen: "No",
    notes: "",
  });

  // We'll store the file in state
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // File input change handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ProjectForm handleSubmit called");

    if (!user) {
      alert("Please log in first.");
      console.log("User not logged in, returning early");
      return;
    }

    try {
      console.log("Generating project code and parsing data...");
      // 1) Generate a human-readable code for this project
      const projectCode = generateProjectCode();

      // 2) Convert budget/buyIn to integers
      const parseBudget = parseInt(formData.budget, 10) || 0;
      const parseBuyIn = parseInt(formData.buyIn, 10) || 0;

      let imageUrl = "";
      // 3) If user selected an image, upload to Storage
      if (imageFile) {
        console.log("Uploading image:", imageFile.name);
        // e.g. /projectImages/PROJ-XXXXXX/<filename>
        const storageRef = ref(
          storage,
          `projectImages/${projectCode}/${imageFile.name}`
        );

        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
        console.log("Image uploaded, url:", imageUrl);
      }

      console.log("Creating doc at /projects/" + projectCode);

      // 4) Create the doc at /projects/{projectCode}
      await setDoc(doc(db, "projects", projectCode), {
        projectCode,
        location: formData.location,
        propertyType: formData.propertyType,
        projectType: formData.projectType,
        startDate: formData.startDate,
        budget: parseBudget,
        buyIn: parseBuyIn,
        passiveOpen: formData.passiveOpen,
        notes: formData.notes,
        submittedBy: user.email,
        fundedSoFar: 0,
        timestamp: Timestamp.now(),
        imageUrl,
      });

      console.log("Project created successfully:", projectCode);
      alert(`✅ Project submitted!`);

      // Option A: Reload
      // window.location.reload();

      // Option B: Navigate back to ProjectsPage or wherever:
      navigate("/projects");
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("❌ Error submitting project.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Dashboard Nav */}
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
        <Link to="/members" className="text-sm text-blue-500 hover:underline">
          View All Members
        </Link>
      </nav>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Submit a Project
        </h2>

        <input
          name="location"
          placeholder="Project Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Build to Sell">Build to Sell</option>
          <option value="Build to Let">Build to Let</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          name="budget"
          placeholder="Project Budget (€)"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          name="buyIn"
          placeholder="Buy-in Amount (€)"
          value={formData.buyIn}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <select
          name="passiveOpen"
          value={formData.passiveOpen}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Yes">Open to Passive Investors? Yes</option>
          <option value="No">Open to Passive Investors? No</option>
        </select>

        <textarea
          name="notes"
          placeholder="Additional notes (max 500 characters)"
          value={formData.notes}
          onChange={handleChange}
          maxLength={500}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-medium text-gray-700">
          Project Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
