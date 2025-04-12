// src/components/FAQAccordion.js
import React, { useState } from "react";

const faqs = [
  {
    question: "💬 Who can join CBI?",
    answer:
      "Anyone interested in property development and construction — whether you're a skilled tradesperson, designer, or investor — is welcome.",
  },
  {
    question: "💶 How much do I need to invest?",
    answer:
      "Projects vary, but many start with members contributing between €2,000–€5,000 each. Every project is its own entity, so members vote on structure and buy-in.",
  },
  {
    question: "👷‍♂️ Do I need tools or experience?",
    answer:
      "Nope! Some members bring hands-on skills and equipment, others contribute money, design work, admin, or coordination. We build around everyone’s strengths.",
  },
  {
    question: "🏗 How are profits shared?",
    answer:
      "Equally — if 10 people contribute evenly to a project, they all split profits evenly. You decide as a team how to run it.",
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
