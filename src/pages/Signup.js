// src/pages/Signup.js
import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // db no longer needed here
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MemberForm from "../components/MemberForm"; // <-- Import MemberForm

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [paid, setPaid] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // 1. Load LaunchPass script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.launchpass.com/co-operative-builders-network/access/v2/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 2. Check paid status via your backend
  const checkIfPaid = async () => {
    if (!email) return;

    try {
      const res = await fetch(
        `https://cbi-backend-l001.onrender.com/api/is-paid?email=${encodeURIComponent(
          email
        )}`
      );
      const data = await res.json();
      if (data.paid) {
        setPaid(true);
        console.log("✅ Payment confirmed for:", email);
      } else {
        console.log("❌ Payment not found for:", email);
      }
    } catch (err) {
      console.error("Error checking payment:", err);
    }
  };

  // 3. Continuously watch for popup close and recheck payment
  useEffect(() => {
    if (paid || !email) return;

    let lastLaunch = 0;
    const interval = setInterval(() => {
      const iframe = document.querySelector("iframe[src*='launchpass']");
      const now = Date.now();

      // Relaunch the popup if it’s been closed for more than 10s
      if (!iframe && now - lastLaunch > 10000) {
        document.querySelector(".lpbtn")?.click();
        lastLaunch = now;
      }

      if (iframe) {
        checkIfPaid();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [paid, email]);

  const handleLaunchPassClick = () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    document.querySelector(".lpbtn")?.click();
  };

  // 4. Create user with email & password after payment
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUserCreated(true);
      setSuccess("Account created! Please complete your member profile below.");
      // Optionally redirect to /dashboard after the MemberForm is filled
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Try logging in instead.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        CBI Member Signup
      </h1>

      {/* Step 1: Collect email + handle payment */}
      {!paid ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600 mb-4">
            To create a member profile and access project opportunities, you
            must first pay the membership fee.
          </p>
          <input
            type="email"
            placeholder="Enter your email to continue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLaunchPassClick}
              className="lp6475702170157056 lpbtn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center space-x-2"
              yearly="true"
            >
              <span>Join the CBI Network</span>
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Log in here
            </a>
          </p>
        </div>
      ) : (
        <>
          {/* Step 2: Email is paid, so create password/user */}
          {error && (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-green-600 mb-4 text-center"
            >
              {success}
            </motion.div>
          )}

          {!userCreated && (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Complete Signup
              </button>
            </form>
          )}

          {/* Step 3: Once user is created, show MemberForm */}
          {userCreated && (
            <div className="mt-8">
              <MemberForm />
            </div>
          )}

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Log in here
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default Signup;
