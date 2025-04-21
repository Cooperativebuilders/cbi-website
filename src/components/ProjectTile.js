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

  // Parse numeric fields
  const budget = parseInt(project.budget, 10) || 0;
  const fundedSoFar = parseInt(project.fundedSoFar, 10) || 0;

  // Determine share size: budget / 149 (rounded)
  const shareSize =
    project.projectType === "Build to Let"
      ? Math.round(budget / 149)
      : parseInt(project.buyIn, 10) || 0;

  const percentFunded =
    budget > 0 ? Math.min(Math.round((fundedSoFar / budget) * 100), 100) : 0;

  async function handleJoin() {
    if (!user) {
      return alert("You must be logged in to join a project.");
    }

    // For buy-to-let, ask how many shares. For others, default 1.
    let shares = 1;
    if (project.projectType === "Build to Let") {
      const maxShares = Math.floor((budget - fundedSoFar) / shareSize);
      const input = prompt(
        `Each share is €${shareSize.toLocaleString()}. How many shares would you like? (Max ${maxShares})`,
        "1"
      );
      if (!input) return;
      shares = parseInt(input, 10);
      if (isNaN(shares) || shares < 1 || shares > maxShares) {
        return alert(`Please enter a number between 1 and ${maxShares}.`);
      }
    } else {
      if (
        !window.confirm(
          `This will contribute one buy-in of €${shareSize.toLocaleString()}. Continue?`
        )
      )
        return;
    }

    const contribution = shareSize * shares;

    try {
      const participantRef = doc(
        db,
        "projects",
        projectId,
        "participants",
        user.uid
      );
      const snap = await getDoc(participantRef);

      if (snap.exists()) {
        // If already joined, update their total
        const prev = parseInt(snap.data().buyIn || "0", 10);
        await updateDoc(participantRef, {
          buyIn: (prev + contribution).toString(),
        });
      } else {
        // First-time join
        await setDoc(participantRef, {
          userUid: user.uid,
          email: user.email || "NoEmailFound",
          buyIn: contribution.toString(),
          joinedAt: serverTimestamp(),
        });
      }

      // Bump project fundedSoFar
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        fundedSoFar: fundedSoFar + contribution,
      });

      alert(
        `✅ You contributed €${contribution.toLocaleString()} ${
          shares > 1 ? `(${shares} shares)` : ""
        } to ${project.location}!`
      );
      window.location.reload();
    } catch (err) {
      console.error("Error joining project:", err);
      alert("❌ Failed to join this project. Try again later.");
    }
  }

  async function handleDelete() {
    if (!isAdmin) {
      return alert("Only admins can delete projects.");
    }
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await deleteDoc(doc(db, "projects", projectId));
      alert("✅ Project deleted.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("❌ Failed to delete project.");
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      {/* Project image, if any */}
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt="Project"
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {project.location}
      </h3>

      <p className="text-sm text-gray-500 mb-1">
        <strong>Type:</strong> {project.propertyType} / {project.projectType}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Budget:</strong> €{budget.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Funded:</strong> {percentFunded}% (€
        {fundedSoFar.toLocaleString()})
      </p>
      {project.projectType === "Build to Let" && (
        <p className="text-sm text-gray-500 mb-1">
          <strong>Share size:</strong> €{shareSize.toLocaleString()}
        </p>
      )}

      <p className="text-sm text-gray-600 italic mb-2">
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
          className="absolute top-2 right-2 text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-100"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default ProjectTile;
