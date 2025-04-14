// components/BackToDashboardButton.js
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackToDashboardButton = () => (
  <div className="mb-4">
    <Link
      to="/dashboard"
      className="inline-flex items-center text-blue-600 hover:underline text-sm"
    >
      <FaArrowLeft className="mr-2" /> Back to Dashboard
    </Link>
  </div>
);

export default BackToDashboardButton;
