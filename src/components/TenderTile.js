import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";
import { Link } from "react-router-dom";

function TenderTile({ tender, tenderId }) {
  const [user] = useAuthState(auth);
  const isAdmin = user && adminUIDs.includes(user.uid);
  const isPoster = user && tender.postedBy === user.uid;

  async function handleDelete() {
    if (!isAdmin && !isPoster) {
      return alert("Only admins or the original poster can delete this tender.");
    }
    if (!window.confirm("Are you sure you want to delete this tender?")) return;
    try {
      await deleteDoc(doc(db, "tenders", tenderId));
      alert("✅ Tender deleted.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting tender:", err);
      alert("❌ Failed to delete tender.");
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {tender.description}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Type:</strong> {tender.type}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Start:</strong> {tender.startDate}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Deadline:</strong> {tender.deadline}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Budget:</strong> €{tender.budget}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Contact:</strong> {tender.contact}
      </p>
      {(isAdmin || isPoster) && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-100"
        >
          Delete
        </button>
      )}
      {isPoster && (
        <Link
          to={`/edit-tender/${tenderId}`}
          className="absolute top-2 right-16 text-blue-600 text-xs border border-blue-600 px-2 py-1 rounded hover:bg-blue-100"
        >
          Edit
        </Link>
      )}
    </div>
  );
}

export default TenderTile;