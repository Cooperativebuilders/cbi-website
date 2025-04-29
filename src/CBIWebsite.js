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
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 px-4 bg-white shadow-md rounded-xl mb-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <img src="/CB Text Logo.png" alt="CBI Logo" className="w-24 h-24" />
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

      {/* Hero (Banner) with background image */}
      <section
        className="relative h-96 rounded-xl shadow-xl overflow-hidden mb-10 max-w-4xl mx-auto"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Build Together. Profit Together.
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl">
            Co-operative Builders Ireland (CBI) connecting skilled tradespeople
            and property investors to renovate, build, and thrive – as one.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition"
          >
            Get Involved
          </Link>
        </div>
      </section>

      {/* Main content */}
      <main id="home" className="space-y-8 max-w-4xl mx-auto">
        {/* Three Sections: "About Us", "Membership Details", "Become a Developer" */}
        {[
          {
            title: "About Us",
            content:
              "CBI is a diverse, community-driven network of skilled trades, construction professionals, and investors who collaborate on building and renovation projects. Our flexible structures allow members to contribute at different levels, with each participant benefiting from shared knowledge and collective gains. Whether you’re a tradesperson seeking collaborative opportunities or an investor looking for new ventures, CBI brings everyone together to shape a more sustainable, transparent, and profitable future for construction.",
          },
          {
            title: "Membership Details",
            content:
              "As a member of CBI, you’ll gain access to a vibrant network of tradespeople, construction professionals, and property investors. Members can propose and vote on new property ideas via our Members Dashboard, forming self-managed project teams with shared profit.",
          },
          {
            title: "Become a Developer",
            content:
              "Looking to build a legacy in real estate but don’t know where to start? You’ve come to the right place. CBI is a diverse collective of builders, investors, and dreamers who believe in turning big ideas into actual properties. We share resources, expertise, and profits—making real estate development accessible to everyone. Join our Network today and take the first step toward creating long-term wealth and impactful change in your community.",
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
              <Link
                to="/signup"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Join Now
              </Link>
            )}
          </section>
        ))}

        {/* FAQs */}
        <section
          id="faqs"
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 mt-12"
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
          <p className="text-sm text-gray-500 text-center mt-4">
            Have more questions?{" "}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contact us
            </Link>
            .
          </p>
        </section>

        {/* Solari Grid */}
        <section className="mb-12">
          <RoleGrid />
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-12 py-4 border-t max-w-4xl mx-auto">
        <p>© 2025 Co-operative Builders Ireland. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CBIWebsite;
