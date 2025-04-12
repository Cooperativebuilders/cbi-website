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

  // 🔄 Fetch counts every 10s
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
        );
        const result = await res.json();
        console.log("✅ Discord data fetched:", result);
        if (result.success && result.data) {
          setCounts(result.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch Discord role counts", err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // ⏱ Animate flip with cascading delay
  useEffect(() => {
    professions.forEach((role, index) => {
      const target = counts[role] || 0;
      let current = displayedCounts[role] || 0;
      const step = target > current ? 1 : -1;
      const totalFlips = Math.abs(target - current);

      if (totalFlips === 0) return;

      // ⏱ Stagger each role’s start time
      const staggerDelay = index * 150;

      setTimeout(() => {
        let flips = 0;
        const interval = setInterval(() => {
          current += step;
          flips++;

          setDisplayedCounts((prev) => ({
            ...prev,
            [role]: current,
          }));

          // 🔊 Tick sound
          const tick = new Audio("/tick.mp3");
          tick.volume = 0.4;
          tick.play().catch(() => {});

          if (flips >= totalFlips) {
            clearInterval(interval);
          }
        }, 70); // speed per tick within each role
      }, staggerDelay);
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
