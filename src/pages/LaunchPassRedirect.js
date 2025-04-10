import React, { useEffect } from "react";

const LaunchPassRedirect = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.launchpass.com/co-operative-builders-network/access/v2/embed.js";
    script.async = true;

    script.onload = () => {
      // Wait until .lpbtn actually exists in the DOM
      const waitForButton = setInterval(() => {
        const button = document.querySelector(".lpbtn");
        const iframe = document.querySelector("iframe[src*='launchpass']");

        if (button && !iframe) {
          button.click();
          clearInterval(waitForButton); // Only click once
        }
      }, 1000); // Check every second

      // Give up after 20 seconds
      setTimeout(() => clearInterval(waitForButton), 20000);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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
