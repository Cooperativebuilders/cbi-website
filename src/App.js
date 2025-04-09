import React from 'react';

const CBIWebsite = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
     <header className="flex justify-between items-center py-6 px-4 md:px-8 bg-white shadow-md rounded-xl mb-8">
  <div className="flex items-center space-x-4">
    <img
      src="/CB Text Logo.png"
      alt="CBI Logo"
      className="w-12 h-12"
    />
    <h1 className="text-2xl font-bold text-gray-800">Co-operative Builders Ireland</h1>
  </div>

  <nav className="space-x-6 text-blue-600 font-medium text-lg">
    <a href="#home" className="hover:text-blue-800 transition">Home</a>
    <a href="#faqs" className="hover:text-blue-800 transition">FAQs</a>
  </nav>
</header>


      <main id="home" className="max-w-4xl mx-auto space-y-8">
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


        <button target="_blank"
        style="font-family: sans-serif;
        margin: 0 auto; outline: none;
        display: block;
        height: 45px;
        width: 226px;
        border-radius: 6px;
        background: #6e9bcf;
        color: white;
        box-shadow: 1px 1px 3px 0 rgba(0,0,0,.03);
        font-size: 18px;
        font-weight: 700;
        border: none;
        cursor: pointer;"
          class="lp6475702170157056 lpbtn" monthly="true">Pay Monthly €4.99</button>
        <br/>
        <button target="_blank"
          style="font-family: sans-serif;
          margin: 0 auto; outline: none;
          display: block;
          height: 45px;
          width: 226px;
          border-radius: 6px;
          background: #6e9bcf;
          color: white;
          box-shadow: 1px 1px 3px 0 rgba(0,0,0,.03);
          font-size: 18px;
          font-weight: 700;
          border: none;
          cursor: pointer;"
          class="lp6475702170157056 lpbtn" yearly="true">Pay Yearly €40.00</button>


<section id="faqs" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 mt-12 max-w-4xl mx-auto">
  <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Frequently Asked Questions</h2>

  <div className="space-y-6 text-gray-700 text-lg">
    <div>
      <h3 className="font-semibold text-blue-500">💬 Who can join CBI?</h3>
      <p>Anyone interested in property development and construction — whether you're a skilled tradesperson, designer, or investor — is welcome.</p>
    </div>

    <div>
      <h3 className="font-semibold text-blue-500">💶 How much do I need to invest?</h3>
      <p>Projects vary, but many start with members contributing between €2,000–€5,000 each. Every project is its own entity, so members vote on structure and buy-in.</p>
    </div>

    <div>
      <h3 className="font-semibold text-blue-500">👷‍♂️ Do I need tools or experience?</h3>
      <p>Nope! Some members bring hands-on skills and equipment, others contribute money, design work, admin, or coordination. We build around everyone’s strengths.</p>
    </div>

    <div>
      <h3 className="font-semibold text-blue-500">🏗 How are profits shared?</h3>
      <p>Equally — if 10 people contribute evenly to a project, they all split profits evenly. You decide as a team how to run it.</p>
    </div>
  </div>
</section>

<script async src="https://www.launchpass.com/co-operative-builders-network/access/v2/embed.js"></script>

      </main>

      <footer className="text-center text-gray-500 mt-12 py-4 border-t">
        <p>© 2025 Co-operative Builders Ireland. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CBIWebsite;

