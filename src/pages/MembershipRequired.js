// MembershipRequired.js
import React, { useEffect } from "react";

const MembershipRequired = () => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-4">
        Membership Required
      </h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        It looks like your membership isn’t active yet. Please complete your
        subscription to unlock full access.
      </p>
      <button
        className="lp6475702170157056 lpbtn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        yearly="true"
      >
        Join the CBI Network
      </button>
    </div>
  );
};

export default MembershipRequired;
