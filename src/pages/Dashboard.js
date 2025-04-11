import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  // 🔐 Verify payment status using backend
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

      if (data?.paid) {
        console.log("✅ Payment verified for", user.email);
      } else {
        console.warn("❌ No payment found — redirecting to LaunchPass");
        navigate("/membership-required");
      }
    } catch (err) {
      console.error("⚠️ Error verifying payment:", err);
      alert("There was an error checking your membership status.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 🔄 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyPayment(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await verifyPayment(result.user);
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await verifyPayment(result.user);
    } catch (error) {
      console.error("Email login error", error);
      alert("Login failed. Check your credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // 🔐 If not logged in, show login screen
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <img
          src={`${process.env.PUBLIC_URL}/Big Text Logo.png`}
          alt="CBI Logo"
          className="w-80 h-80 mb-6"
        />
        />
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

  // ✅ Main dashboard content for paid, logged-in users
  return (
    <div className="min-h-screen bg-white p-6">
      <motion.h1
        className="text-4xl font-bold text-blue-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Member Dashboard
      </motion.h1>

      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600">
          Logged in as <strong>{user.displayName || user.email}</strong>
        </p>
        <button
          onClick={handleLogout}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Logout
        </button>
      </div>

      <motion.p
        className="text-lg text-gray-600 mb-8"
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
        <li>Update your CBI card</li>
        <li>Track project participants</li>
        <li>Submit or support project ideas</li>
        <li>Join project groups when ready</li>
      </motion.ul>
    </div>
  );
};

export default Dashboard;
