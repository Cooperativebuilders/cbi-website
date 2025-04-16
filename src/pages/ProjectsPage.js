// src/pages/ProjectsPage.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; // Removed unused imports
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import ProjectTile from "../components/ProjectTile";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [user] = useAuthState(auth);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const data = querySnapshot.docs.map((doc) => ({
          // Preserve Firestore doc.id in our object
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
        <Link
          to="/submit-project"
          className="text-sm text-blue-500 hover:underline"
        >
          Submit New Project
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-blue-700 mb-6">All Projects</h1>

      {projects.length === 0 ? (
        <p className="text-gray-600">No projects submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              {/* Pass both the project data and its doc ID */}
              <ProjectTile project={project} projectId={project.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
