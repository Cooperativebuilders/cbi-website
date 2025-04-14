import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import CBIWebsite from "./CBIWebsite";
import Dashboard from "./pages/Dashboard";
import MembershipRequired from "./pages/MembershipRequired";
import MembersPage from "./pages/MembersPage";
import EditProfile from "./pages/EditProfile";
import ProjectsPage from "./pages/ProjectsPage"; // ✅ Add this line

function App() {
  return (
    <Routes>
      <Route path="/" element={<CBIWebsite />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/membership-required" element={<MembershipRequired />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  );
}

export default App;
