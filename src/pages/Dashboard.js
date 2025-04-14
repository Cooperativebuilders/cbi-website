// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DashboardSidebar from "../components/DashboardSidebar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyPayment = async (user) => {
    if (!user?.email) return;
    setIsVerifying(true);
    try {
      const res = await fetch(
        `https://cbi-backend-l001.onrender.com/api/is-paid?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();
      if (!data?.paid) {
        navigate("/membership-required");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      alert("Error checking membership status.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyPayment(currentUser);

        // Create Firestore doc if it doesn’t exist
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-600">
        Not logged in.{" "}
        <Link to="/signup" className="ml-2 underline">
          Sign up here
        </Link>
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
