import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./solari.css"; // We’ll create this next

const professions = [
  "Carpenter",
  "Electrician",
  "Plumber",
  "Architect",
  "Engineer",
  "Project Manager",
  "Roofer",
  "Bricklayer",
  "Surveyor",
  "Tiler",
  "Painter",
  "Groundworker",
  "HVAC",
  "Plasterer",
  "Steel Fixer",
  "Site Admin",
];

const RoleGrid = () => {
  const [roleCounts, setRoleCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          "https://cbi-backend-l001.onrender.com/api/discord-role-counts"
        );
        const data = await res.json();
        setRoleCounts(data);
      } catch (err) {
        console.error("Failed to fetch role counts:", err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto my-12">
      {professions.map((role) => (
        <div
          key={role}
          className="bg-white shadow-lg rounded-xl p-4 text-center flex flex-col justify-between h-32"
        >
          <div className="text-blue-700 font-bold text-lg">{role}</div>
          <motion.div
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flip-counter text-4xl font-mono text-gray-900 mt-2"
          >
            {roleCounts[role.toLowerCase()] ?? 0}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default RoleGrid;
