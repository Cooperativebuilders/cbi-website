import React from 'react';

const CBIWebsite = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-gray-100 to-gray-300 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">Co-operative Builders Ireland</h1>
        <p className="text-2xl text-gray-700">Building together. Profiting together.</p>
      </header>

      <section className="mb-12">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-xl transition transform hover:scale-105">
          <h2 className="text-3xl font-semibold mb-4 text-blue-700">About Us</h2>
          <p className="text-lg text-gray-800">
            Co-operative Builders Ireland (CBI) is a community-driven network of skilled trades and construction professionals.
            We work together as equal stakeholders to build, renovate, and profit collectively.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-xl transition transform hover:scale-105">
          <h2 className="text-3xl font-semibold mb-4 text-blue-700">Join the Community</h2>
          <p className="text-lg text-gray-800">
            Become part of a community where everyone invests equally, works equally, and shares profits. 
            Connect with like-minded professionals on Discord.
          </p>
          <a
            href="https://www.launchpass.com/co-operative-builders-network/access"
            className="mt-6 inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            Join via LaunchPass
          </a>
        </div>
      </section>

      <footer className="text-center text-gray-600 mt-12">
        <p className="text-sm">© 2025 Co-operative Builders Ireland. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CBIWebsite;