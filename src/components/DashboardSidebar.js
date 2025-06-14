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
  FaPlusSquare,
  FaFileSignature,
  FaClipboardList,
} from "react-icons/fa";

const DashboardSidebar = ({ onLogout }) => {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center space-x-2 p-3 rounded-md hover:bg-blue-100 transition ${
      location.pathname === path ? "bg-blue-100 font-semibold" : ""
    }`;

  return (
    <aside className="w-60 bg-white shadow-lg min-h-screen px-4 py-6">
      {/* Logo only (now h-56 for double the previous h-28 size) */}
      <div className="flex items-center justify-center mb-8">
        <img
          src="/big-text-logo.png"
          alt="CBI Logo"
          className="h-56 w-auto" // doubled from h-28 to h-56
        />
      </div>

      <nav className="space-y-4">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <FaHome /> <span>Dashboard Home</span>
        </Link>
        <Link to="/edit-profile" className={linkClass("/edit-profile")}>
          <FaUserEdit /> <span>Edit My Info</span>
        </Link>
        <Link to="/members" className={linkClass("/members")}>
          <FaUsers /> <span>View Members</span>
        </Link>
        <Link to="/submit-project" className={linkClass("/submit-project")}>
          <FaPlusSquare /> <span>Submit Project</span>
        </Link>
        <Link to="/projects" className={linkClass("/projects")}>
          <FaProjectDiagram /> <span>View Projects</span>
        </Link>
        <Link to="/submit-tender" className={linkClass("/submit-tender")}>
          <FaFileSignature /> <span>Submit Tender</span>
        </Link>
        <Link to="/tenders" className={linkClass("/tenders")}>
          <FaClipboardList /> <span>View Tenders</span>
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
