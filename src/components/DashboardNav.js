// src/components/DashboardNav.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const DashboardNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/dashboard");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-wrap justify-between items-center">
      <div className="flex space-x-4 text-blue-600 font-medium text-sm sm:text-base">
        <Link to="/dashboard" className="hover:text-blue-800">
          Home
        </Link>
        <Link to="/members" className="hover:text-blue-800">
          Members
        </Link>
        <Link to="/submit-project" className="hover:text-blue-800">
          Submit Project
        </Link>
        <Link to="/my-projects" className="hover:text-blue-800">
          My Projects
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="mt-2 sm:mt-0 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default DashboardNav;
