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
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DashboardSidebar from "../components/DashboardSidebar";
import { adminUIDs } from "../constants/admins";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // For login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const verifyPayment = async (user) => {
    if (!user?.email) return;

    // ✅ Admins bypass
    if (adminUIDs.includes(user.uid)) {
      console.log("✅ Admin bypass");
      return true;
    }

    try {
      const res = await fetch(
        `https://cbi-backend-l001.onrender.com/api/is-paid?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();

      if (data.paid) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("❌ Error during payment check:", err);
      return false;
    }
  };

  // 🔁 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsVerifying(true);
        const paid = await verifyPayment(currentUser);

        if (!paid) {
          navigate("/membership-required");
          return;
        }

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

        setIsVerifying(false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await verifyPayment(result.user);
    } catch (err) {
      console.error("Email login error", err);
      alert("Login failed");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await verifyPayment(result.user);
    } catch (err) {
      console.error("Google login error", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  // ⏳ Not logged in yet
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login with Email
          </button>
          <button
            onClick={handleLogin}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Sign in with Google
          </button>
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
        <motion.ul
          className="list-disc list-inside text-gray-700 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
