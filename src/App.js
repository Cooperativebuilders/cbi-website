import React from 'react';

const CBIWebsite = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Co-operative Builders Ireland</h1>
        <p className="text-xl text-gray-600">Building together. Profiting together.</p>
      </header>

      <section className="mb-8">
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-700">
            Co-operative Builders Ireland (CBI) is a network of skilled trades and construction professionals. We work together as equal stakeholders to build, renovate, and profit together.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Join the Community</h2>
          <p className="text-gray-700">
            Be part of a community where everyone invests equally, works equally, and shares profits. Connect with like-minded professionals on Discord.
          </p>
          <a
            href="https://launchpass.com/CBI"
            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Join via LaunchPass
          </a>
        </div>
      </section>

      <footer className="text-center text-gray-600 mt-12">
        <p>© 2025 Co-operative Builders Ireland. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CBIWebsite;