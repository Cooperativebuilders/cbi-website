import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [locations, setLocations] = useState("");
  const [readiness, setReadiness] = useState("");
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Load LaunchPass Script
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

  // Observe DOM for popup closure
  useEffect(() => {
    if (!paid) {
      const observer = new MutationObserver(() => {
        const popup = document.querySelector("iframe[src*='launchpass']");
        if (!popup) {
          document.querySelector(".lpbtn")?.click(); // Reopen if closed
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, [paid]);

  const handlePaymentComplete = () => {
    setPaid(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      await setDoc(doc(db, "profiles", user.uid), {
        email,
        occupation,
        experience,
        specializations,
        locations,
        readiness,
        name: "",
      });

      setSuccess("Account created! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
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

      {!paid ? (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
          <motion.h2
            className="text-2xl font-bold text-blue-700 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            CBI Membership Required
          </motion.h2>
          <p className="text-gray-600 mb-6 max-w-sm">
            To create a member profile and access project opportunities, you
            must first pay the membership fee.
          </p>
          <button
            className="lp6475702170157056 lpbtn bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handlePaymentComplete}
            yearly="true"
          >
            Pay Membership Fee
          </button>
        </div>
      ) : (
        <>
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

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              className="w-full p-2 border rounded"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            >
              <option value="">Occupation</option>
              <option>Tradesperson</option>
              <option>Construction Professional</option>
              <option>Eager Beginner</option>
              <option>Passive Investor</option>
            </select>
            <input
              type="number"
              placeholder="Years of experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Specializations (e.g. underfloor heating)"
              value={specializations}
              onChange={(e) => setSpecializations(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Project Locations (e.g. Dublin, Cork)"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              className="w-full p-2 border rounded"
              value={readiness}
              onChange={(e) => setReadiness(e.target.value)}
            >
              <option value="">Ready to Go?</option>
              <option>Currently seeking projects</option>
              <option>Currently developing</option>
              <option>Not ready</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Complete Signup
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Signup;
