// src/pages/Guidance.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase"; // <-- from your firebase.js
import { adminUIDs } from "../constants/admins";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

const Guidance = () => {
  const [user] = useAuthState(auth);
  const isAdmin = user && adminUIDs.includes(user.uid);

  // We'll store all guidance docs here
  const [guidanceDocs, setGuidanceDocs] = useState([]);

  // Fetch real-time from Firestore
  useEffect(() => {
    // Reference to 'guidanceNotes' collection
    const colRef = collection(db, "guidanceNotes");
    // Optional: we can sort by 'title' or 'createdAt' if you have that field
    const q = query(colRef, orderBy("title", "asc"));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id, // Firestore doc ID
        ...docSnap.data(),
      }));
      setGuidanceDocs(docsData);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // Toggle the 'visible' field in Firestore
  const toggleVisibility = async (docId, currentVisible) => {
    try {
      await updateDoc(doc(db, "guidanceNotes", docId), {
        visible: !currentVisible,
      });
      // No need to manually update local state, onSnapshot will refresh
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  // Filter for visible docs if user is NOT admin
  const displayDocs = isAdmin
    ? guidanceDocs // Admin sees all
    : guidanceDocs.filter((doc) => doc.visible);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 font-bold text-xl hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-blue-700 mb-6">Guidance Notes</h1>

      {/* If admin, show toggle panel */}
      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Admin Controls
          </h2>
          {guidanceDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex justify-between items-center bg-white p-3 rounded shadow mb-2"
            >
              <span className="font-medium">{doc.title}</span>
              <button
                onClick={() => toggleVisibility(doc.id, doc.visible)}
                className={`px-3 py-1 text-sm rounded ${
                  doc.visible
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {doc.visible ? "Hide" : "Show"}
              </button>
            </div>
          ))}
        </div>
      )}

      {displayDocs.length === 0 ? (
        <p className="text-gray-500">No guidance notes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {doc.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
              {doc.pdfUrl && (
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guidance;
