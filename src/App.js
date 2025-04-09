import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import CBIWebsite from "./CBIWebsite";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CBIWebsite />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
