// src/components/ProjectTile.js
import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";

const ProjectTile = ({ project, projectId }) => {
  const [user] = useAuthState(auth);

  const isAdmin = user && adminUIDs.includes(user.uid);

  console.log("Current user UID:", user?.uid);
  console.log("Is admin?", isAdmin);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
      alert("✅ Project deleted.");
      // If you really want a full page refresh here:
      // window.location.reload();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("❌ Failed to delete project.");
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
        {project.passiveOpen === "Yes" ? "✅ Yes" : "❌ No"}
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

      {isAdmin && (
        <button
          onClick={handleDelete}
          // Now using absolute + z-50
          className="absolute top-2 right-2 z-50 text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-100"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ProjectTile;
