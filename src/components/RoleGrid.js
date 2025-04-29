// src/components/RoleGrid.js
import React, { useEffect, useState } from "react";
import "./RoleGrid.css";

const professions = [
  "Passive Investor",
  "Real Estate",
  "Planning",
  "Legal",
  "Accountant",
  "Supplier",
  "Architect",
  "Civil Engineer",
  "Structural Engineer",
  "Fire Engineer",
  "Surveyor",
  "Health & Safety Officer",
  "Project Manager",
  "Site Foreman",
  "Groundworker",
  "Dumper Operator",
  "Teleporter Operator",
  "Excavator Operator",
  "Banksman",
  "Crane Operator",
  "Steel Fixer",
  "Bricklayer",
  "Scaffolder",
  "Carpenter",
  "Welder",
  "Roofer",
  "Plumber (RGI)",
  "Electrician",
  "HVAC Technician",
  "Plasterer",
  "Tiler",
  "Glazier",
  "Painter / Decorator",
  "Landscaper",
  "Skilled Labourer",
  "Labourer",
];

const RoleGrid = () => {
  const [counts, setCounts] = useState({});
  const [displayedCounts, setDisplayedCounts] = useState({});

  const fetchCounts = async () => {
    try {
      const res = await fetch(
        "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
      );
      const result = await res.json();
      if (result.success && result.data) {
        setCounts(result.data);
        console.log("✅ Discord data fetched:", result.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch Discord role counts", err);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    professions.forEach((role, i) => {
      const target = counts[role] || 0;
      let current = displayedCounts[role] || 0;
      if (target === current) return;
      const step = target > current ? 1 : -1;
      const delay = 120 + i * 24;

      const interval = setInterval(() => {
        current += step;
        setDisplayedCounts((prev) => ({
          ...prev,
          [role]: current,
        }));
        if (current === target) clearInterval(interval);
      }, delay);
    });
  }, [counts]);

  return (
    <div className="grid-container">
      {professions.map((role) => (
        <div key={role} className="grid-tile">
          <div className="role-title">{role}</div>
          <div className="flip-counter">
            <span className="solari">{displayedCounts[role] || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleGrid;
