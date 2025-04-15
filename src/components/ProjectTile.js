// src/components/ProjectTile.js
import React, { useEffect, useState } from "react";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ProjectTile = ({ project }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);

  const projectRef = doc(db, "projects", project.id);

  useEffect(() => {
    const fetchParticipants = async () => {
      const snapshot = await getDocs(collection(projectRef, "participants"));
      const list = snapshot.docs.map((doc) => doc.data());
      setParticipants(list);
      setHasJoined(list.some((p) => p.uid === user?.uid));
    };

    if (user) fetchParticipants();
  }, [project.id, user]);

  const handleJoin = async () => {
    if (!user || hasJoined) return;
    try {
      await addDoc(collection(projectRef, "participants"), {
        uid: user.uid,
        email: user.email,
        joinedAt: new Date().toISOString(),
      });
      setHasJoined(true);
      setParticipants((prev) => [...prev, { uid: user.uid }]);
    } catch (err) {
      console.error("Error joining project:", err);
      alert("Failed to join the project.");
    }
  };

  const percentFunded =
    project.buyIn > 0
      ? Math.min(
          Math.round(
            ((participants.length * project.buyIn) / project.budget) * 100
          ),
          100
        )
      : 0;

  const isAdmin = user?.email === "admin@cooperativebuilders.ie";

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await deleteDoc(projectRef);
      alert("✅ Project deleted.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting project:", err);
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

      {!isAdmin && user && !hasJoined && (
        <button
          onClick={handleJoin}
          className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm"
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
};

export default ProjectTile;
