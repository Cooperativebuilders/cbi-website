// src/pages/MembershipRequired.js (or wherever you're verifying)
import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const MembershipRequired = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [checking, setChecking] = useState(true);

  // ✅ Stable verifyPayment function
  const verifyPayment = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/dashboard");
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
        navigate("/dashboard");
      } else {
        setChecking(false);
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      setChecking(false);
    }
  }, [auth, navigate]);

  // ✅ Properly referenced in useEffect
  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 px-6 text-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Membership Required
      </h1>
      {checking ? (
        <p className="text-gray-600">Checking your subscription status...</p>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            You must be a paid member to access this content.
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-blue-600 hover:underline"
          >
            Try another way to log in?
          </button>
        </>
      )}
    </div>
  );
};

export default MembershipRequired;
