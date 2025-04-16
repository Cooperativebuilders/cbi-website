// src/components/ProjectTile.js
import React from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";

const ProjectTile = ({ project, projectId }) => {
  // 1) Get current logged-in user info
  const [user] = useAuthState(auth);

  // 2) Check if this user is an admin
  const isAdmin = user && adminUIDs.includes(user.uid);

  console.log("Current user UID:", user?.uid);
  console.log("Is admin?", isAdmin);

  // ------------------------------
  // JOIN PROJECT BUTTON CLICK
  // ------------------------------
  const handleJoin = async () => {
    if (!user) {
      alert("You must be logged in to join a project.");
      return;
    }

    // Optional confirmation prompt
    const confirmJoin = window.confirm(
      "Are you sure you want to join this project? You will contribute one buy-in."
    );
    if (!confirmJoin) return;

    try {
      // 1) Figure out the current fundedSoFar
      const fundedSoFar = project.fundedSoFar || 0;
      const buyInAmount = project.buyIn || 0;
      const newFundedSoFar = fundedSoFar + buyInAmount;

      // 2) Build references
      const projectRef = doc(db, "projects", projectId);
      const participantRef = doc(
        db,
        "projects",
        projectId,
        "participants",
        user.uid
      );

      // 3) Write participant data (email, uid, buyIn, timestamp)
      await setDoc(participantRef, {
        userUid: user.uid,
        email: user.email || "NoEmailFound",
        buyIn: buyInAmount,
        joinedAt: serverTimestamp(),
      });

      // 4) Update the project's fundedSoFar total
      await updateDoc(projectRef, {
        fundedSoFar: newFundedSoFar,
      });

      // 5) Alert success
      alert(
        `You contributed €${buyInAmount.toLocaleString()} to ${
          project.location
        }!`
      );
    } catch (error) {
      console.error("Error joining project:", error);
      alert("❌ Failed to join this project. Please try again later.");
    }
  };

  // ------------------------------
  // DELETE PROJECT BUTTON CLICK
  // ------------------------------
  const handleDelete = async () => {
    if (!user) {
      alert("You must be logged in as admin to delete a project.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
      alert("✅ Project deleted.");
      // If you want a full refresh, uncomment the line below
      // window.location.reload();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("❌ Failed to delete project.");
    }
  };

  // ------------------------------
  // CALCULATE FUNDED PERCENT
  // ------------------------------
  const fundedSoFar = project.fundedSoFar || 0;
  const budget = project.budget || 0;
  const buyIn = project.buyIn || 0;

  const percentFunded =
    budget > 0 ? Math.min(Math.round((fundedSoFar / budget) * 100), 100) : 0;

  // ------------------------------
  // RENDER UI
  // ------------------------------
  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      {/* Basic Project Info */}
      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {project.location}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Type:</strong> {project.propertyType} / {project.projectType}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Project Budget:</strong> €{budget.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Buy-in:</strong> €{buyIn.toLocaleString()} —{" "}
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

      {/* Join Project button: visible to any logged-in user */}
      {user && (
        <button
          onClick={handleJoin}
          className="text-blue-600 text-xs border border-blue-600 px-2 py-1 rounded hover:bg-blue-100 mr-2"
        >
          Join Project
        </button>
      )}

      {/* Delete button: visible to admin only */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 z-50 text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-100"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ProjectTile;
