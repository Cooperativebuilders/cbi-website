// src/components/ProjectTile.js
import React from "react";

const ProjectTile = ({ project }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {project.location}
      </h3>

      <p className="text-sm text-gray-500 mb-1">
        <strong>Type:</strong> {project.propertyType} / {project.projectType}
      </p>

      <p className="text-sm text-gray-500 mb-1">
        <strong>Budget:</strong> €{project.budget?.toLocaleString()}
      </p>

      <p className="text-sm text-gray-500 mb-1">
        <strong>Target Start:</strong> {project.startDate}
      </p>

      <p className="text-sm text-gray-500 mb-1">
        <strong>Submitted by:</strong> {project.submittedBy}
      </p>

      {project.notes && (
        <div className="mt-3 bg-blue-50 p-3 rounded">
          <p className="text-sm text-gray-700">
            <strong>Notes:</strong> {project.notes.slice(0, 500)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectTile;
