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
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DiscordWidget from "../components/DiscordWidget";
import { adminUIDs } from "../constants/admins";

// RECHARTS IMPORTS
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  // ---------------------------
  // AUTH & LOADING STATES
  // ---------------------------
  const [user, setUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  // For email login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ---------------------------
  // MY PROJECTS STATES
  // ---------------------------
  const [myProjects, setMyProjects] = useState([]); // array of { projectId, projectData, userBuyIn }
  const [totalInvestment, setTotalInvestment] = useState(0);

  // ---------------------------
  // LOGIN METHODS
  // ---------------------------
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

  // ---------------------------
  // PAYMENT CHECK
  // ---------------------------
  const verifyPayment = async (user) => {
    if (!user?.email) return;
    setIsVerifying(true);

    // Admin bypass
    if (adminUIDs.includes(user.uid)) {
      console.log("✅ Admin bypass: Access granted for", user.email);
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
        console.log("✅ Paid member verified:", user.email);
        setLoading(false);
      } else {
        console.warn("❌ Not a paid member:", user.email);
        navigate("/membership-required");
      }
    } catch (err) {
      console.error("❌ Error verifying payment:", err);
      alert("Error checking membership status.");
      navigate("/membership-required");
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------------------------
  // onAuthStateChanged
  // ---------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyPayment(currentUser);

        // Create doc in 'members' if not exists
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

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // ---------------------------
  // REAL-TIME FETCH OF ALL PROJECTS & FILTER
  // ---------------------------
  useEffect(() => {
    if (!user) return;

    // We only fetch user’s projects after verifying user is logged in
    const unsub = onSnapshot(collection(db, "projects"), async (snapshot) => {
      const joinedProjects = [];

      for (const projDoc of snapshot.docs) {
        const projectData = projDoc.data();
        const projectId = projDoc.id;

        // participant sub-doc
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
          const userBuyIn = parseInt(participantData.buyIn || "0", 10);

          joinedProjects.push({
            projectId,
            projectData,
            userBuyIn,
          });
        }
      }

      setMyProjects(joinedProjects);

      // compute total
      let total = 0;
      for (const jp of joinedProjects) {
        total += jp.userBuyIn;
      }
      setTotalInvestment(total);
    });

    return () => unsub();
  }, [user]);

  // ---------------------------
  // LOADING STATES
  // ---------------------------
  if (!user) {
    // Not logged in, show login UI
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

  // ---------------------------
  // PREP DATA FOR PIE CHART
  // ---------------------------
  const chartData = myProjects.map((jp) => {
    const location = jp.projectData.location || "Untitled";
    return {
      name: location,
      value: jp.userBuyIn,
    };
  });

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#d0ed57",
    "#a4de6c",
    "#8dd1e1",
  ];

  // ---------------------------
  // FINAL DASHBOARD RENDER
  // ---------------------------
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

        {/* GRID CONTAINER */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Projects Overview Card */}
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
              <ul className="space-y-3">
                {myProjects.map(({ projectId, projectData, userBuyIn }) => {
                  const budget = parseInt(projectData.budget || "0", 10);
                  const fundedSoFar = parseInt(
                    projectData.fundedSoFar || "0",
                    10
                  );
                  const percentFunded =
                    budget > 0
                      ? Math.min(Math.round((fundedSoFar / budget) * 100), 100)
                      : 0;

                  return (
                    <li
                      key={projectId}
                      className="bg-gray-50 rounded-md p-3 border"
                    >
                      <p className="font-bold text-blue-700">
                        {projectData.location} ({projectData.propertyType} /{" "}
                        {projectData.projectType})
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Budget: €{budget.toLocaleString()} — Funded:{" "}
                        {percentFunded}%
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Your Buy-In:</strong> €
                        {userBuyIn.toLocaleString()}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Funding Breakdown Card */}
          <section className="bg-white shadow p-4 rounded-md">
            <motion.h2
              className="text-2xl font-semibold text-blue-800 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Funding Breakdown
            </motion.h2>

            <div>
              <p className="text-gray-700">
                <strong>Total Projects Joined:</strong> {myProjects.length}
              </p>
              <p className="text-gray-700">
                <strong>Total Investment:</strong> €
                {totalInvestment.toLocaleString()}
              </p>
            </div>
          </section>

          {/* Investment Distribution (Pie Chart) */}
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

          {/* Discord Chat Card */}
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
