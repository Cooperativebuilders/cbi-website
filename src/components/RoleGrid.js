// src/components/RoleGrid.js
import React, { useEffect, useState } from "react";
import "./RoleGrid.css"; // we'll create this next

const professions = [
  "Carpenter",
  "Electrician",
  "Plumber-RGI",
  "Tiler",
  "Bricklayer",
  "Groundworker",
  "Plasterer",
  "Welder",
  "Landscaper",
  "Roofer",
  "Architect",
  "Engineer",
  "Quantity Surveyor",
  "Construction Manager",
  "Skilled Labourer",
  "Supplier",
];

const RoleGrid = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
        );
        const data = await res.json();
        setCounts(data || {});
      } catch (err) {
        console.error("Failed to fetch Discord role counts", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid-container">
      {professions.map((role) => (
        <div key={role} className="grid-tile">
          <div className="role-title">{role}</div>
          <div className="flip-counter">
            {counts[role] !== undefined ? (
              <span className="solari">{counts[role]}</span>
            ) : (
              <span className="solari">0</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleGrid;
