// src/components/DashboardSidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserEdit,
  FaUsers,
  FaProjectDiagram,
  FaSignOutAlt,
  FaHome,
  FaBook,
} from "react-icons/fa";
import logo from "../public/big-text-logo.png"; // <-- Adjust path if needed

const DashboardSidebar = ({ onLogout }) => {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center space-x-2 p-3 rounded-md hover:bg-blue-100 transition ${
      location.pathname === path ? "bg-blue-100 font-semibold" : ""
    }`;

  return (
    <aside className="w-60 bg-white shadow-lg min-h-screen px-4 py-6">
      {/* Logo + Title Section */}
      <div className="flex items-center space-x-2 mb-8">
        <img src={logo} alt="CBI Logo" className="h-10 w-auto" />
        <span className="text-2xl font-bold text-blue-700">CBI Dashboard</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <FaHome /> <span>Dashboard Home</span>
        </Link>
        <Link to="/edit-profile" className={linkClass("/edit-profile")}>
          <FaUserEdit /> <span>Edit My Tile Info</span>
        </Link>
        <Link to="/members" className={linkClass("/members")}>
          <FaUsers /> <span>View Members</span>
        </Link>
        <Link to="/submit-project" className={linkClass("/submit-project")}>
          <FaProjectDiagram /> <span>Submit Project</span>
        </Link>
        <Link to="/projects" className={linkClass("/projects")}>
          <FaProjectDiagram /> <span>View Projects</span>
        </Link>
        <Link to="/guidance" className={linkClass("/guidance")}>
          <FaBook /> <span>Guidance Notes</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 p-3 w-full text-left text-red-600 hover:bg-red-100 transition rounded-md"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
