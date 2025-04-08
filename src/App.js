import React from 'react';

const CBIWebsite = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <header className="text-center py-12">
        <img
          src="/CB Text Logo.png"
          alt="CBI Logo"
          className="mx-auto mb-6 w-24 h-24"
        />
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Co-operative Builders Ireland</h1>
        <p className="text-xl text-gray-600">Connecting Construction. Building Futures.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">About Us</h2>
          <p className="text-lg text-gray-700">
            Co-operative Builders Ireland (CBI) is a community-driven network of skilled trades and construction professionals. 
            We work together as equal stakeholders to build, renovate, and profit collectively.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Membership Details</h2>
          <p className="text-lg text-gray-700">
            As a member of Co-operative Builders Ireland (CBI), you’ll gain access to a vibrant network of tradespeople, construction professionals, and eager property investors. Whether you're a skilled builder or just getting started, CBI connects you with likeminded individuals ready to collaborate on real development projects.
          </p>
          <p className="text-lg text-gray-700 mt-4">
            Every member has the power to pitch new property ideas to the entire network. Got a vision for a renovation or new build? Share it, rally support, and build it together. With CBI, you're never building alone – you're building together.
          </p>
          <p className="text-lg text-gray-700 mt-4">
            Each project operates as its own independent entity. When a group forms around a proposal, they decide how it’s structured – from the number of participants to roles, responsibilities, and investment amounts. You’ll be part of a self-directed team where decisions are made collectively, and everyone shares the risk and the reward.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Join the Community</h2>
          <p className="text-lg text-gray-700 mb-4">
            Become part of a community where everyone invests equally, works equally, and shares profits. 
            Connect with like-minded professionals on Discord.
          </p>
          <a
            href="https://www.launchpass.com/co-operative-builders-network/access"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Join via LaunchPass
          </a>
        </section>
      </main>

      <footer className="text-center text-gray-500 mt-12 py-4 border-t">
        <p>© 2025 Co-operative Builders Ireland. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CBIWebsite;

