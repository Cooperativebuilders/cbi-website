// src/components/FAQAccordion.js
import React, { useState } from "react";

const faqs = [
  {
    question: "💬 What is Co-operative Builders Ireland (CBI)?",
    answer:
      "CBI is a decentralized network where tradespeople, construction professionals, and investors collaborate to buy, renovate, or build property. Everyone shares ownership, has equal rights, and receives a fair share of the profits.",
  },
  {
    question: "🤝 Who can join CBI?",
    answer:
      "Anyone interested in property development and construction — whether you're a skilled tradesperson, construction professional, or investor — is welcome to join.",
  },
  {
    question: "💶 How much do I need to invest?",
    answer:
      "The minimum buy-ins are set by the members who propose each project. They can also decide whether or not to include passive investors. There’s no single fixed amount across all projects, so the cost to join can vary widely based on each project's goals and team preferences.",
  },
  {
    question: "👷‍♂️ Do I need tools or experience?",
    answer:
      "If you plan to work on-site, you need a valid Safe Pass and manual handling certification. If you’re new to construction, investing in basic hand and power tools—a combi-drill, SDS drill, measuring tape, hammer, and nail bar—will help you contribute more effectively. You’ll also need the right PPE: steel-toe footwear, work trousers, hard hat, gloves, safety glasses, mask, and ear protection. Not everyone has to be on-site, though; some members focus on design, finances, or admin, so there’s room for all skill levels.",
  },
  {
    question: "💁‍♂️ How do I become a member of CBI?",
    answer:
      "Sign up on our website. Once you’re in, you can propose projects, vote on ideas, and collaborate with other members. We’ll guide you through the process.",
  },
  {
    question: "💸 How does the investment work?",
    answer:
      "Your funds are pooled with other members' to purchase or build properties. A group-selected solicitor holds all money until they incorporate the group as a company, they then transfer the funds to the company bank account. When a project is completed and sold (or rented), profits are shared according to each member’s stake.",
  },
  {
    question: "🎁 What are the benefits of joining CBI?",
    answer:
      "Equal voting rights, shared costs, a professional network, and real transparency at every stage. You collaborate with architects, surveyors, carpenters, electricians and fellow investors in a truly cooperative environment.",
  },
  {
    question: "📱 What is the CBI Dashboard, and how does it work?",
    answer:
      "It’s your digital hub for proposing projects, tracking milestones, and voting on key decisions. Once enough members commit, a dedicated group is formed, and the Dashboard helps manage everything from budgeting to final sale.",
  },
  {
    question: "🏗 How are profits shared?",
    answer:
      "Profits are distributed based on your share of the total investment. If you contributed 10% of a project’s funds, you receive 10% of that project's profits.",
  },
  {
    question: "🤑 Are there any additional costs after the initial investment?",
    answer:
      "Beyond membership and your project investment, there may be extra costs like renovation overruns or legal fees. These are discussed, voted on, and shared transparently among the project group.",
  },
  {
    question: "📑 How are projects managed within CBI?",
    answer:
      "Projects are formed by interested members. Once a threshold is reached, a dedicated chat is created. Members vote on contractors, budgets, and timelines, with progress tracked on the CBI Dashboard and Discord Server.",
  },
  {
    question: "💬 How do I communicate with other members?",
    answer:
      "We primarily use Discord for real-time conversation and collaboration. The CBI Dashboard is evolving every day and will soon include built-in messaging, forums for project-specific discussions, and more. Eventually, we plan to pivot away from Discord and consolidate everything onto our own purpose-built platform for seamless collaboration.",
  },
  {
    question: "⚠️ What if a member cannot complete their tasks?",
    answer:
      "If you can’t fulfill your responsibilities, let the group know immediately so tasks can be reassigned or outsourced. Any associated costs or timeline changes are voted on. Transparency and teamwork keep projects on track.",
  },
];

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="space-y-4 text-gray-700 text-lg">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-blue-200 rounded-lg">
          <button
            onClick={() => toggleIndex(index)}
            className="w-full text-left px-4 py-3 font-semibold text-blue-700 flex justify-between items-center"
          >
            <span>{faq.question}</span>
            <span className="text-xl">{activeIndex === index ? "−" : "+"}</span>
          </button>
          {activeIndex === index && (
            <div className="px-4 pb-4 pt-1 text-gray-600">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
