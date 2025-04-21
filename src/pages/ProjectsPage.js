// src/pages/ProjectsPage.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import ProjectTile from "../components/ProjectTile";
import { adminUIDs } from "../constants/admins";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const available = [];

        for (const proj of snapshot.docs) {
          const projectData = proj.data();
          const projectId = proj.id;

          // If logged in and not an admin, skip ones they've joined
          if (user && !adminUIDs.includes(user.uid)) {
            const partRef = doc(
              db,
              "projects",
              projectId,
              "participants",
              user.uid
            );
            const partSnap = await getDoc(partRef);
            if (partSnap.exists()) {
              continue;
            }
          }

          available.push({ id: projectId, ...projectData });
        }

        setProjects(available);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [user]);

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
        <p className="text-gray-600">
          {user
            ? "No available projects right now."
            : "Please log in to see available projects."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <ProjectTile project={project} projectId={project.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
