// src/components/ProjectTile.js
import React from "react";
import { Link } from "react-router-dom";

const ProjectTile = ({ project }) => {
  const participantCount = project.participants?.length || 0;
  const buyIn = project.buyIn || 1; // prevent divide by zero
  const capacity = Math.floor((project.budget || 0) / buyIn);
  const percentFunded = Math.min(
    Math.round((participantCount / capacity) * 100),
    100
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
      <h3 className="text-xl font-bold text-blue-700">{project.location}</h3>

      <p className="text-sm text-gray-600">
        <strong>Type:</strong> {project.propertyType} / {project.projectType}
      </p>

      <p className="text-sm text-gray-600">
        <strong>Budget:</strong> €{project.budget?.toLocaleString()}
      </p>

      <p className="text-sm text-gray-600">
        <strong>Buy-in:</strong> €{project.buyIn?.toLocaleString()}
      </p>

      <p className="text-sm text-gray-600">
        <strong>Open to Passive Investors:</strong> {project.openToPassive}
      </p>

      <p className="text-sm text-gray-600">
        <strong>Target Start:</strong> {project.startDate}
      </p>

      <div className="text-sm text-gray-600">
        <strong>Funding:</strong> {participantCount}/{capacity} slots filled (
        <span className="text-green-600 font-semibold">{percentFunded}%</span>)
      </div>

      {project.notes && (
        <p className="text-sm text-gray-500 italic">"{project.notes}"</p>
      )}

      <p className="text-sm text-gray-500">
        <strong>Submitted by:</strong> {project.submittedBy}
      </p>
    </div>
  );
};

export default ProjectTile;
