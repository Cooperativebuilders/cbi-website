// src/components/RoleGrid.js
import React, { useEffect, useState } from "react";
import "./RoleGrid.css";

const professions = [
  "Carpenter",
  "Electrician",
  "Plumber",
  "Tiler",
  "Bricklayer",
  "Groundworker",
  "Plasterer",
  "Welder",
  "Landscaper",
  "Roofer",
  "Architect",
  "Engineer",
  "Surveyor",
  "Project Manager",
  "Skilled Labourer",
  "Supplier",
];

const RoleGrid = () => {
  const [counts, setCounts] = useState({});
  const [displayedCounts, setDisplayedCounts] = useState({});

  // Fetch role counts from backend
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

  // Fetch counts initially and every 10s
  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animate displayedCounts when counts changes
  useEffect(() => {
    professions.forEach((role, i) => {
      const target = counts[role] || 0;
      let current = displayedCounts[role] || 0;

      if (target === current) return; // No change needed

      // If target>current, step=1. If target<current, step=-1.
      const step = target > current ? 1 : -1;
      // Delay between increments, slightly staggered by i
      const delay = 120 + i * 24;

      const interval = setInterval(() => {
        current += step;

        setDisplayedCounts((prev) => ({
          ...prev,
          [role]: current,
        }));

        // Optionally play sound or vibrate each increment:
        /*
        const tickSound = new Audio("/tick.mp3");
        tickSound.volume = 0.3;
        tickSound.play().catch(() => {});

        if (navigator.vibrate) navigator.vibrate(10);
        */

        // Stop interval once we reach the target
        if (current === target) {
          clearInterval(interval);
        }
      }, delay);
    });
  }, [counts]);
  // Only re-run animation when 'counts' changes

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
