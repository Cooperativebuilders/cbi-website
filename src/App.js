import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import CBIWebsite from "./CBIWebsite";
import Dashboard from "./pages/Dashboard";
import LaunchPassRedirect from "./pages/LaunchPassRedirect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CBIWebsite />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/launchpass" element={<LaunchPassRedirect />} />
      <Route path="/launchpass-redirect" element={<LaunchPassRedirect />} />
    </Routes>
  );
}

export default App;
