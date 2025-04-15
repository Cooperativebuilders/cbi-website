// src/components/ProjectTile.js
import React, { useState, useEffect } from "react";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";

const ProjectTile = ({ project, projectId }) => {
  const [user] = useAuthState(auth);
  const [participantCount, setParticipantCount] = useState(0);
  const isAdmin = user && adminUIDs.includes(user.uid);

  // 🔄 Fetch number of participants on load
  useEffect(() => {
    const fetchParticipants = async () => {
      const snap = await getDocs(
        collection(db, "projects", projectId, "participants")
      );
      setParticipantCount(snap.size);
    };

    fetchParticipants();
  }, [projectId]);

  const percentFunded =
    project.buyIn > 0
      ? Math.min(
          Math.round(
            ((participantCount * project.buyIn) / project.budget) * 100
          ),
          100
        )
      : 0;

  const handleJoin = async () => {
    if (!user) return alert("Please log in to join a project.");
    try {
      await addDoc(collection(db, "projects", projectId, "participants"), {
        uid: user.uid,
        email: user.email,
        joinedAt: new Date().toISOString(),
      });
      setParticipantCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error joining project:", err);
      alert("Failed to join project.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
      alert("✅ Project deleted.");
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to delete project:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {project.location}
      </h3>

      <p className="text-sm text-gray-500 mb-1">
        <strong>Type:</strong> {project.propertyType} / {project.projectType}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Budget:</strong> €{project.budget?.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Buy-in:</strong> €{project.buyIn?.toLocaleString()} —{" "}
        <strong>{percentFunded}% funded</strong>
      </p>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Submitted by:</strong> {project.submittedBy}
      </p>
      <p className="text-sm text-gray-500 italic">
        <strong>Notes:</strong> {project.notes || "No notes added."}
      </p>

      {/* 🔘 Join Project */}
      {!isAdmin && (
        <button
          onClick={handleJoin}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Join Project
        </button>
      )}

      {/* 🗑️ Admin Delete */}
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
};

export default ProjectTile;
