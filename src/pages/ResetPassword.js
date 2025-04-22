import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  // --- FORCE ONE-TIME RELOAD ON MOUNT ---
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("resetReloaded");
    if (!hasReloaded) {
      // mark that we've reloaded once
      sessionStorage.setItem("resetReloaded", "true");
      // reload the page
      window.location.reload();
    } else {
      // clean up so subsequent visits will reload again if needed
      sessionStorage.removeItem("resetReloaded");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "✅ Check your inbox for a password reset link. (And your spam folder!)"
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

      {message && (
        <p className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {message}
        </p>
      )}
      {error && (
        <p className="bg-red-100 text-red-800 p-2 mb-4 rounded">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Remembered your password?{" "}
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
