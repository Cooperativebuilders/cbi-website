// src/pages/ProjectsPage.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import ProjectTile from "../components/ProjectTile";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const data = querySnapshot.docs.map((doc) => ({
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

  const handleJoinProject = async (projectId) => {
    if (!user) return alert("You must be logged in to join a project.");
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        participants: arrayUnion(user.uid),
      });
      alert("✅ You’ve joined the project!");
      window.location.reload();
    } catch (err) {
      console.error("Error joining project:", err);
      alert("There was an issue joining the project.");
    }
  };

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
              <ProjectTile project={project} />
              {user && (
                <button
                  onClick={() => handleJoinProject(project.id)}
                  className="absolute bottom-2 right-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Join Project
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
