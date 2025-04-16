// src/components/ProjectTile.js

import React from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";

function ProjectTile({ project, projectId }) {
  const [user] = useAuthState(auth);
  const isAdmin = user && adminUIDs.includes(user.uid);

  // Convert fields to numbers
  const budget = parseInt(project.budget, 10) || 0;
  const buyIn = parseInt(project.buyIn, 10) || 0;
  const fundedSoFar = parseInt(project.fundedSoFar, 10) || 0;

  // Calculate percentage
  const percentFunded =
    budget > 0 ? Math.min(Math.round((fundedSoFar / budget) * 100), 100) : 0;

  async function handleJoin() {
    if (!user) {
      alert("You must be logged in to join a project.");
      return;
    }
    const confirmJoin = window.confirm(
      `Are you sure you want to join this project? You will contribute one buy-in of €${buyIn}.`
    );
    if (!confirmJoin) return;

    try {
      // Check if participant doc exists
      const participantRef = doc(
        db,
        "projects",
        projectId,
        "participants",
        user.uid
      );
      const snap = await getDoc(participantRef);
      if (snap.exists()) {
        alert("❌ You have already joined this project.");
        return;
      }

      // Create participant doc
      await setDoc(participantRef, {
        userUid: user.uid,
        email: user.email || "NoEmailFound",
        buyIn: buyIn.toString(),
        joinedAt: serverTimestamp(),
      });

      // Update fundedSoFar
      const newFundedSoFar = fundedSoFar + buyIn;
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, { fundedSoFar: newFundedSoFar });

      alert(
        `You contributed €${buyIn.toLocaleString()} to ${project.location}!`
      );
    } catch (error) {
      console.error("Error joining project:", error);
      alert("❌ Failed to join this project. Please try again later.");
    }
  }

  async function handleDelete() {
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
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("❌ Failed to delete project.");
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
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

      {user && (
        <button
          onClick={handleJoin}
          className="text-blue-600 text-xs border border-blue-600 px-2 py-1 rounded hover:bg-blue-100 mr-2"
        >
          Join Project
        </button>
      )}

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
}

export default ProjectTile;
