// src/components/RoleGrid.js
import React, { useEffect, useState, useRef } from "react";
import "./RoleGrid.css";
import tickSound from "../assets/tick.mp3"; // Make sure this file exists

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
  const [animatedCounts, setAnimatedCounts] = useState({});
  const targetCounts = useRef({});
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
        );
        const data = await res.json();

        professions.forEach((role) => {
          const raw = data[role] ?? 0;
          const normalized = role.toLowerCase().trim();
          targetCounts.current[normalized] = raw;
        });

        animateAll();
      } catch (err) {
        console.error("Failed to fetch Discord role counts", err);
      }
    };

    fetchCounts();
  }, []);

  const animateAll = () => {
    professions.forEach((role) => {
      const key = role.toLowerCase().trim();
      const target = targetCounts.current[key] || 0;
      let current = 0;

      const interval = setInterval(() => {
        setAnimatedCounts((prev) => ({
          ...prev,
          [key]: current,
        }));

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }

        current++;
        if (current > target) clearInterval(interval);
      }, 75);
    });
  };

  return (
    <>
      <audio ref={audioRef} src={tickSound} preload="auto" />
      <div className="grid-container">
        {professions.map((role) => {
          const key = role.toLowerCase().trim();
          const count = animatedCounts[key] ?? 0;

          return (
            <div key={role} className="grid-tile">
              <div className="role-title">{role}</div>
              <div className="flip-counter">
                <span className="solari">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RoleGrid;
