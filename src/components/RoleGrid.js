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

  // ✅ Fetch role counts on load + every 10 seconds
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
        );
        const result = await res.json();
        console.log("✅ Discord data fetched:", result);
        if (result.success && result.data) {
          setCounts(result.data); // <- This is key!
        }
      } catch (err) {
        console.error("❌ Failed to fetch Discord role counts", err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Animate displayed count up/down with tick sound
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

        // ✅ Play tick sound each time it flips
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
