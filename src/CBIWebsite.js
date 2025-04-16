import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import RoleGrid from "./components/RoleGrid";
import FAQAccordion from "./components/FAQAccordion";

const CBIWebsite = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.launchpass.com/co-operative-builders-network/access/v2/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 px-4 bg-white shadow-md rounded-xl mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <img src="/CB Text Logo.png" alt="CBI Logo" className="w-10 h-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Co-operative Builders Ireland
          </h1>
        </div>
        <nav className="flex justify-center sm:justify-end space-x-4 text-blue-600 text-base sm:text-lg font-medium">
          <Link to="/" className="hover:text-blue-800 transition">
            Home
          </Link>
          <a href="#faqs" className="hover:text-blue-800 transition">
            FAQs
          </a>
          <Link to="/dashboard" className="hover:text-blue-800 transition">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-xl overflow-hidden mb-10 px-6 py-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
          Build Together. Profit Together.
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
          Co-operative Builders Ireland (CBI) connects skilled tradespeople and
          property investors to renovate, build, and thrive – as one.
        </p>
        <a
          href="/signup"
          className="inline-block bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition"
        >
          Get Involved
        </a>
      </section>

      {/* Main content */}
      <main id="home" className="space-y-8">
        {[
          {
            title: "About Us",
            content:
              "CBI is a community-driven network of skilled trades and construction professionals. We work together as equal stakeholders to build, renovate, and profit collectively.",
          },
          {
            title: "Membership Details",
            content:
              "As a member of CBI, you’ll gain access to a vibrant network of tradespeople, professionals, and property investors. Members can propose and vote on new property ideas, forming self-managed project teams with shared profit.",
          },
          {
            title: "Join the Community",
            content:
              "Become part of a network where everyone invests equally, works equally, and shares profits. Join the Discord to start connecting.",
            button: true,
          },
        ].map((section, i) => (
          <section
            key={i}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
              {section.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              {section.content}
            </p>
            {section.button && (
              <button
                target="_blank"
                className="lp6475702170157056 lpbtn bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                yearly="true"
              >
                Join Now
              </button>
            )}
          </section>
        ))}

        {/* FAQs */}
        <section
          id="faqs"
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 mt-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
          <p className="text-sm text-gray-500 text-center mt-4">
            Have more questions?{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact us
            </a>
            .
          </p>
        </section>

        {/* Solari Grid */}
        <section className="mb-12">
          <RoleGrid />
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-12 py-4 border-t">
        <p>© 2025 Co-operative Builders Ireland. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CBIWebsite;
