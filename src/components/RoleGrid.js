// src/components/RoleGrid.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RoleGrid.css";
const tickSound = new Audio("/tick.mp3"); // Place tick.mp3 in public folder

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
        setCounts((prev) => {
          Object.keys(data).forEach((role) => {
            if (prev[role] !== data[role]) {
              tickSound.play(); // play on change
            }
          });
          return data;
        });
      } catch (err) {
        console.error("Failed to fetch Discord role counts", err);
      }
    };

    fetchCounts(); // Initial fetch
    const interval = setInterval(fetchCounts, 15000); // Refresh every 15s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid-container">
      {professions.map((role) => {
        const count = counts[role] ?? 0;

        return (
          <div key={role} className="grid-tile">
            <div className="role-title">{role}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={count}
                className="flip-counter solari"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {count}
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default RoleGrid;
