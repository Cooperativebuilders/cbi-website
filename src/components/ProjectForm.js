// src/components/ProjectForm.js
import React, { useState } from "react";
import { doc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
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
  const navigate = useNavigate(); // We'll navigate after a successful submit

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

  // Handle text/select field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // **Reordered** handleSubmit: Create Firestore doc first, then upload image.
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ProjectForm handleSubmit called");

    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      // 1) Generate a human-readable code for this project
      const projectCode = generateProjectCode();
      console.log("Generated code:", projectCode);

      const parseBudget = parseInt(formData.budget, 10) || 0;
      const parseBuyIn = parseInt(formData.buyIn, 10) || 0;

      // 2) Create the project doc in Firestore so Storage rules can see "submittedBy"
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
        submittedBy: user.email, // must match rules if referencing email
        fundedSoFar: 0,
        timestamp: Timestamp.now(),
        imageUrl: "", // temporarily empty
      });

      console.log("Project doc created in Firestore");

      // 3) If user selected an image, upload now
      let finalImageUrl = "";
      if (imageFile) {
        console.log("Uploading image:", imageFile.name);
        const storageRef = ref(
          storage,
          `projectImages/${projectCode}/${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        console.log("Upload complete, fetching download URL...");
        finalImageUrl = await getDownloadURL(storageRef);
        console.log("Image URL:", finalImageUrl);
      }

      // 4) If we have an image URL, update the doc
      if (finalImageUrl) {
        console.log("Updating project doc with imageUrl...");
        await updateDoc(doc(db, "projects", projectCode), {
          imageUrl: finalImageUrl,
        });
      }

      alert("✅ Project submitted!");

      // Optionally navigate to ProjectsPage so we don't keep reloading
      navigate("/projects");

      // Or do a reload, if you prefer:
      // window.location.reload();
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
