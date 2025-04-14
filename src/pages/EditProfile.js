// src/pages/EditProfile.js
import React from "react";
import MemberForm from "../components/MemberForm";
import { Link } from "react-router-dom";

const EditProfile = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Dashboard Nav */}
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
        <Link to="/members" className="text-sm text-blue-500 hover:underline">
          View All Members
        </Link>
      </nav>

      {/* Form */}
      <MemberForm />
    </div>
  );
};

export default EditProfile;
