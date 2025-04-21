// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DiscordWidget from "../components/DiscordWidget";
import { adminUIDs } from "../constants/admins";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  // AUTH & LOADING STATES
  const [user, setUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Email login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // MY PROJECTS STATES
  const [myProjects, setMyProjects] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);

  // Slider-editing state
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editUnits, setEditUnits] = useState(0);

  // LOGIN METHODS
  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await verifyPayment(result.user);
    } catch (error) {
      console.error("Email login error", error);
      alert("Login failed. Check your credentials.");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await verifyPayment(result.user);
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  // PAYMENT CHECK
  const verifyPayment = async (user) => {
    if (!user?.email) return;
    setIsVerifying(true);

    if (adminUIDs.includes(user.uid)) {
      setLoading(false);
      setIsVerifying(false);
      return;
    }

    try {
      const res = await fetch(
        `https://cbi-backend-l001.onrender.com/api/is-paid?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();

      if (data.paid) {
        setLoading(false);
      } else {
        navigate("/membership-required");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      alert("Error checking membership status.");
      navigate("/membership-required");
    } finally {
      setIsVerifying(false);
    }
  };

  // onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyPayment(currentUser);
        const userRef = doc(db, "members", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || "",
            createdAt: new Date().toISOString(),
          });
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // REAL-TIME FETCH OF PROJECTS
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "projects"), async (snapshot) => {
      const joinedProjects = [];
      for (const projDoc of snapshot.docs) {
        const projectData = projDoc.data();
        const projectId = projDoc.id;
        const participantRef = doc(
          db,
          "projects",
          projectId,
          "participants",
          user.uid
        );
        const participantSnap = await getDoc(participantRef);
        if (participantSnap.exists()) {
          const participantData = participantSnap.data();
          const userBuyIn = parseFloat(participantData.buyIn || "0");
          joinedProjects.push({ projectId, projectData, userBuyIn });
        }
      }
      setMyProjects(joinedProjects);
      setTotalInvestment(
        joinedProjects.reduce((sum, jp) => sum + jp.userBuyIn, 0)
      );
    });
    return () => unsub();
  }, [user]);

  // START EDIT MODE
  const startEdit = (projectId, projectData, oldBuyIn) => {
    const budget = parseFloat(projectData.budget || 0);
    const step = budget / 149;
    const initialUnits = Math.round(oldBuyIn / step);
    setEditingProjectId(projectId);
    setEditUnits(initialUnits);
  };

  // SAVE SLIDER EDIT
  const saveEdit = async (projectId, projectData, oldBuyIn) => {
    const budget = parseFloat(projectData.budget || 0);
    const step = budget / 149;
    const newBuyIn = Math.round(editUnits * step * 100) / 100;
    const diff = newBuyIn - oldBuyIn;

    try {
      const participantRef = doc(
        db,
        "projects",
        projectId,
        "participants",
        user.uid
      );
      await updateDoc(participantRef, { buyIn: newBuyIn.toString() });

      const projectRef = doc(db, "projects", projectId);
      const projSnap = await getDoc(projectRef);
      const fundedSoFar = parseFloat(projSnap.data()?.fundedSoFar || 0);
      await updateDoc(projectRef, { fundedSoFar: fundedSoFar + diff });

      alert(`✅ Buy‑in updated to €${newBuyIn.toLocaleString()}`);
    } catch (err) {
      console.error("Error updating buy-in:", err);
      alert("❌ Failed to update buy‑in.");
    } finally {
      setEditingProjectId(null);
    }
  };

  // LEAVE PROJECT
  const handleLeaveProject = async (projectId, oldBuyIn) => {
    if (!window.confirm("Are you sure you want to leave this project?")) return;
    try {
      const participantRef = doc(
        db,
        "projects",
        projectId,
        "participants",
        user.uid
      );
      await deleteDoc(participantRef);

      const projectRef = doc(db, "projects", projectId);
      const projSnap = await getDoc(projectRef);
      const fundedSoFar = parseFloat(projSnap.data()?.fundedSoFar || 0);
      await updateDoc(projectRef, { fundedSoFar: fundedSoFar - oldBuyIn });

      alert("✅ You have left the project.");
    } catch (err) {
      console.error("Error leaving project:", err);
      alert("❌ Failed to leave project.");
    }
  };

  // LOADING STATES
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/big-text-logo.png`}
            alt="CBI Logo"
            className="w-80 h-80 mb-6"
          />
        </Link>
        <motion.h1
          className="text-4xl font-bold text-blue-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Member Dashboard
        </motion.h1>
        <p className="text-lg text-gray-600 mb-6">Please log in:</p>
        <div className="space-y-4 w-full max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleEmailLogin}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login with Email
          </button>
          <hr className="my-4" />
          <button
            onClick={handleLogin}
            className="w-full bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Sign in with Google
          </button>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    );
  }
  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 text-lg">
        Loading...
      </div>
    );
  }

  // PREP DATA FOR PIE CHART
  const chartData = myProjects.map((jp) => ({
    name: jp.projectData.location || "Untitled",
    value: jp.userBuyIn,
  }));
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#d0ed57",
    "#a4de6c",
    "#8dd1e1",
  ];

  // RENDER
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <motion.h1
          className="text-4xl font-bold text-blue-700 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Member Dashboard
        </motion.h1>
        <p className="text-gray-600 mb-8">
          Logged in as <strong>{user.displayName || user.email}</strong>
        </p>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Projects Overview */}
          <section className="bg-white shadow p-4 rounded-md">
            <motion.h2
              className="text-2xl font-semibold text-blue-800 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Projects Overview
            </motion.h2>
            {myProjects.length === 0 ? (
              <p className="text-gray-600">
                You haven't joined any projects yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {myProjects.map(({ projectId, projectData, userBuyIn }) => {
                  const budget = parseFloat(projectData.budget || 0);
                  const fundedSoFar = parseFloat(projectData.fundedSoFar || 0);
                  const percentFunded = budget
                    ? Math.min(Math.round((fundedSoFar / budget) * 100), 100)
                    : 0;
                  // calculate total funded shares
                  const step = budget / 149;
                  const fundedShares = Math.round(fundedSoFar / step);

                  return (
                    <li
                      key={projectId}
                      className="bg-gray-50 rounded-md p-4 border"
                    >
                      <p className="font-bold text-blue-700 mb-2">
                        {projectData.location} ({projectData.propertyType} /{" "}
                        {projectData.projectType})
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Budget:</strong> €{budget.toLocaleString()} —{" "}
                        <strong>Funded:</strong> {percentFunded}% (
                        {fundedShares}/149)
                      </p>
                      {!editingProjectId || editingProjectId !== projectId ? (
                        <>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Your Buy‑In:</strong> €
                            {userBuyIn.toLocaleString()}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                startEdit(projectId, projectData, userBuyIn)
                              }
                              className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-300 transition"
                            >
                              Edit Buy‑In
                            </button>
                            <button
                              onClick={() =>
                                handleLeaveProject(projectId, userBuyIn)
                              }
                              className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded hover:bg-red-300 transition"
                            >
                              Leave Project
                            </button>
                          </div>
                        </>
                      ) : (
                        // Slider edit UI
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium">
                              Shares: {editUnits} / 149
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="149"
                              value={editUnits}
                              onChange={(e) =>
                                setEditUnits(Number(e.target.value))
                              }
                              className="w-full"
                            />
                          </div>
                          <p className="text-sm">
                            <strong>Unit Cost:</strong> €{step.toFixed(2)}
                          </p>
                          <p className="text-sm">
                            <strong>Total Cost:</strong> €
                            {(editUnits * step).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                saveEdit(projectId, projectData, userBuyIn)
                              }
                              className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded hover:bg-green-300 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProjectId(null)}
                              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Funding Breakdown */}
          <section className="bg-white shadow p-4 rounded-md">
            <motion.h2
              className="text-2xl font-semibold text-blue-800 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Funding Breakdown
            </motion.h2>
            <p className="text-gray-700">
              <strong>Total Projects Joined:</strong> {myProjects.length}
            </p>
            <p className="text-gray-700">
              <strong>Total Investment:</strong> €
              {totalInvestment.toLocaleString()}
            </p>
          </section>

          {/* Investment Distribution */}
          {myProjects.length > 0 && (
            <section className="bg-white shadow p-4 rounded-md">
              <motion.h2
                className="text-2xl font-semibold text-blue-800 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Investment Distribution
              </motion.h2>
              <div className="mx-auto" style={{ width: 300, height: 300 }}>
                <PieChart width={300} height={300}>
                  <Pie
                    data={chartData}
                    cx={150}
                    cy={150}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </section>
          )}

          {/* Discord Chat */}
          <section className="bg-white shadow p-4 rounded-md md:col-span-2 lg:col-span-1">
            <motion.h2
              className="text-2xl font-semibold text-blue-800 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Live Community Chat
            </motion.h2>
            <DiscordWidget />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
