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
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { adminUIDs } from "../constants/admins";

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
  // NEW: MY PROJECTS STATE
  // ---------------------------
  const [myProjects, setMyProjects] = useState([]); // array of { projectData, userBuyIn }
  const [totalInvestment, setTotalInvestment] = useState(0); // sum of userBuyIn across projects

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
  // FETCH USER'S JOINED PROJECTS
  // ---------------------------
  useEffect(() => {
    if (!user) return;

    // We only fetch user's projects after we've verified the user is logged in
    const fetchMyProjects = async () => {
      try {
        const projSnap = await getDocs(collection(db, "projects"));
        const joinedProjects = [];

        for (const projDoc of projSnap.docs) {
          const projectData = projDoc.data();
          const projectId = projDoc.id;

          // Check if there's a participant sub-doc for this user
          const participantRef = doc(
            db,
            "projects",
            projectId,
            "participants",
            user.uid
          );
          const participantSnap = await getDoc(participantRef);

          if (participantSnap.exists()) {
            // The user joined this project
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

        // Calculate total investment
        let total = 0;
        for (const jp of joinedProjects) {
          total += jp.userBuyIn;
        }
        setTotalInvestment(total);
      } catch (err) {
        console.error("Error fetching user's joined projects:", err);
      }
    };

    fetchMyProjects();
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
  // DASHBOARD LAYOUT
  // ---------------------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <motion.h1
          className="text-4xl font-bold text-blue-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Member Dashboard
        </motion.h1>

        <p className="text-gray-600 mb-6">
          Logged in as <strong>{user.displayName || user.email}</strong>
        </p>

        {/* ============== Projects Overview ============== */}
        <section className="mb-10">
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
                // parse budget from project data
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
                    className="bg-white rounded-md shadow p-4"
                  >
                    <p className="font-bold text-blue-700">
                      {projectData.location} ({projectData.propertyType} /{" "}
                      {projectData.projectType})
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Budget: €{budget.toLocaleString()} – Funded:{" "}
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

        {/* ============== Funding Breakdown ============== */}
        <section className="mb-10">
          <motion.h2
            className="text-2xl font-semibold text-blue-800 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Funding Breakdown
          </motion.h2>

          <div className="bg-white shadow p-4 rounded-md">
            <p className="text-gray-700">
              <strong>Total Projects Joined:</strong> {myProjects.length}
            </p>
            <p className="text-gray-700">
              <strong>Total Investment:</strong> €
              {totalInvestment.toLocaleString()}
            </p>
          </div>
        </section>

        {/* Existing placeholder content */}
        <motion.p
          className="text-lg text-gray-600 mt-6 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to your CBI dashboard. Soon you'll be able to:
        </motion.p>
        <motion.ul
          className="list-disc list-inside text-gray-700 space-y-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <li>Track project participants</li>
          <li>Submit or support project ideas</li>
          <li>Join project groups when ready</li>
        </motion.ul>
      </main>
    </div>
  );
};

export default Dashboard;
