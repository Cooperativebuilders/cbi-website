// src/components/ProjectTile.js
import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";

const ProjectTile = ({ project }) => {
  const [user] = useAuthState(auth);

  // Set your admin UIDs here

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "projects", project.id));
      alert("✅ Project deleted.");
      window.location.reload(); // Simple refresh to update list
    } catch (err) {
      console.error("❌ Failed to delete project:", err);
      alert("Error deleting project.");
    }
  };

  const percentFunded =
    project.buyIn > 0
      ? Math.min(Math.round((project.budget / project.buyIn) * 100), 100)
      : 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {project.location}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Type:</strong> {project.propertyType} / {project.projectType}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Project Budget:</strong> €{project.budget?.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Buy-in:</strong> €{project.buyIn?.toLocaleString()} —{" "}
        <strong>{percentFunded}% funded</strong>
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Open to Passive Investors:</strong>{" "}
        {project.openToPassive === "Yes" ? "✅ Yes" : "❌ No"}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Target Start:</strong> {project.startDate}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Submitted by:</strong> {project.submittedBy}
      </p>
      <p className="text-sm text-gray-600 italic">
        <strong>Notes:</strong> {project.notes || "No notes added."}
      </p>

      {adminUIDs.includes(user?.uid) && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-100"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ProjectTile;
