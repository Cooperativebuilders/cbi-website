// src/pages/GuidancePage.js
import React from "react";
import { Link } from "react-router-dom";

const GuidancePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-blue-700 mb-6">Guidance Notes</h1>

      <p className="text-gray-600">
        This is a test render of the Guidance page.
      </p>
    </div>
  );
};

export default GuidancePage;
