import React, { useEffect } from "react";

const LaunchPassRedirect = () => {
  useEffect(() => {
    // 1. Load LaunchPass script
    const script = document.createElement("script");
    script.src =
      "https://www.launchpass.com/co-operative-builders-network/access/v2/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // 2. Try to auto-click the LaunchPass button every second until popup opens
    const interval = setInterval(() => {
      const iframe = document.querySelector("iframe[src*='launchpass']");
      const button = document.querySelector(".lpbtn");
      if (!iframe && button) {
        button.click();
      }
    }, 1000);

    return () => {
      document.body.removeChild(script);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Complete Your Membership
      </h1>
      <button
        className="lp6475702170157056 lpbtn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        yearly="true"
      >
        Open LaunchPass Portal
      </button>
    </div>
  );
};

export default LaunchPassRedirect;
