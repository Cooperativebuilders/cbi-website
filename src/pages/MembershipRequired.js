// src/pages/MembershipRequired.js
import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { adminUIDs } from "../constants/admins";

const MembershipRequired = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [checking, setChecking] = useState(true);

  const verifyPayment = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setChecking(false);
      return;
    }

    // ✅ Admin bypass
    if (adminUIDs.includes(user.uid)) {
      console.log("✅ Admin bypass triggered");
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
        console.log("✅ Paid member detected");
        navigate("/dashboard");
      } else {
        console.warn("❌ Not paid");
        setChecking(false);
      }
    } catch (err) {
      console.error("Error checking payment:", err);
      setChecking(false);
    }
  }, [navigate, auth]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  const handleLogoutAndRedirect = async () => {
    try {
      await signOut(auth);
      navigate("/signup");
    } catch (err) {
      console.error("Logout failed:", err);
    }
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
            onClick={handleLogoutAndRedirect}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Become a CBI Member Today
          </button>
        </>
      )}
    </div>
  );
};

export default MembershipRequired;
