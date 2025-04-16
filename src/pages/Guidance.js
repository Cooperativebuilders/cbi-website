import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import guidanceListData from "../data/guidanceList";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { adminUIDs } from "../constants/admins";

const Guidance = () => {
  const [user] = useAuthState(auth);
  const isAdmin = user && adminUIDs.includes(user.uid);

  // Clone guidance list into local state so we can toggle visibility
  const [guidanceList, setGuidanceList] = useState([]);

  useEffect(() => {
    // Load static list into local state
    setGuidanceList(guidanceListData);
  }, []);

  const toggleVisibility = (id) => {
    const updated = guidanceList.map((doc) =>
      doc.id === id ? { ...doc, visible: !doc.visible } : doc
    );
    setGuidanceList(updated);
  };

  const visibleGuides = guidanceList.filter((doc) => doc.visible);

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

      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Admin Controls
          </h2>
          {guidanceList.map((doc) => (
            <div
              key={doc.id}
              className="flex justify-between items-center bg-white p-3 rounded shadow mb-2"
            >
              <span className="font-medium">{doc.title}</span>
              <button
                onClick={() => toggleVisibility(doc.id)}
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

      {visibleGuides.length === 0 ? (
        <p className="text-gray-500">No guidance notes available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleGuides.map((doc) => (
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
