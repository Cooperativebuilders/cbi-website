// src/components/RoleGrid.js
import React, { useEffect, useState } from "react";
import "./RoleGrid.css";

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
  const [displayedCounts, setDisplayedCounts] = useState({});

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

  useEffect(() => {
    professions.forEach((role) => {
      const target = counts[role] || 0;
      let current = displayedCounts[role] || 0;

      if (target === current) return;

      const step = target > current ? 1 : -1;
      let delay = 50;

      const interval = setInterval(() => {
        current += step;
        setDisplayedCounts((prev) => ({
          ...prev,
          [role]: current,
        }));

        const tickSound = new Audio("/tick.mp3");
        tickSound.volume = 0.3;
        tickSound.play().catch(() => {});

        if (current === target) {
          clearInterval(interval);
        }
      }, delay);
    });
  }, [counts]);

  return (
    <div className="grid-container">
      {professions.map((role) => (
        <div key={role} className="grid-tile">
          <div className="role-title">{role}</div>
          <div className="flip-counter">
            <span className="solari">
              {displayedCounts[role] !== undefined ? displayedCounts[role] : 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleGrid;
