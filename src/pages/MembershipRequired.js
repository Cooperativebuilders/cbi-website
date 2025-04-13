import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const MembershipRequired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.launchpass.com/co-operative-builders-network/access/v2/embed.js";
    script.async = true;

    script.onload = () => {
      const waitForButton = setInterval(() => {
        const button = document.querySelector(".lpbtn");
        const iframe = document.querySelector("iframe[src*='launchpass']");
        if (button && !iframe) {
          button.click();
          clearInterval(waitForButton);
        }
      }, 1000);

      setTimeout(() => clearInterval(waitForButton), 20000);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogoutAndRedirect = async () => {
    try {
      await signOut(auth);
      navigate("/dashboard");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Complete Your Membership
      </h1>
      <button
        className="lp6475702170157056 lpbtn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        yearly="true"
      >
        Open LaunchPass Portal
      </button>

      <p className="text-sm text-gray-600 mt-6">
        Try another way to log in?{" "}
        <button
          onClick={handleLogoutAndRedirect}
          className="text-blue-600 hover:underline"
        >
          Click here
        </button>
      </p>
    </div>
  );
};

export default MembershipRequired;
