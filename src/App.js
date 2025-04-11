import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import CBIWebsite from "./CBIWebsite";
import Dashboard from "./pages/Dashboard";
import MembershipRequired from "./pages/MembershipRequired";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CBIWebsite />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/membership-required" element={<MembershipRequired />} />
    </Routes>
  );
}

export default App;
