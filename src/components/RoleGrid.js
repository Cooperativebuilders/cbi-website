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
  "Surveyor",
  "Project Manager",
  "Skilled Labourer",
  "Supplier",
];

const RoleGrid = () => {
  const [counts, setCounts] = useState({});
  const [displayedCounts, setDisplayedCounts] = useState({});

  // Fetch Discord role counts from backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
        );
        const result = await res.json();
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

  useEffect(() => {
    document.documentElement.style.setProperty("--title-font-size", "0.72rem");
  }, []);

  // Animate the count updates with sound + haptics
  useEffect(() => {
    professions.forEach((role, index) => {
      const target = counts[role] || 0;
      let current = displayedCounts[role] || 0;
    
      if (target === current) return;
    
      const step = target > current ? 1 : -1;
    
      // ⏱ Delay per number flip
      const tickDelay = 80;
    
      // ⏳ Stagger start per tile for cascade effect
      const tileDelay = index * 200;
    
      setTimeout(() => {
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
        }, tickDelay);
      }, tileDelay);
    });

  return (
    <div className="grid-container">
      {professions.map((role) => (
        <div key={role} className="grid-tile">
          <div className="role-title">{role}</div>
          <div className="flip-counter">
            <span className="solari">{displayedCounts[role] ?? 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleGrid;
