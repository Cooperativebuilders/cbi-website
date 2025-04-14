// src/pages/MembersPage.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import BackToDashboardButton from "../components/BackToDashboardButton";

const MembersPage = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Optional: sort by soonest availability
        data.sort(
          (a, b) =>
            new Date(a.availability || Infinity) -
            new Date(b.availability || Infinity)
        );

        setMembers(data);
      } catch (error) {
        console.error("Error fetching member profiles:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <BackToDashboardButton />
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        CBI Member Directory
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow p-4 space-y-1"
          >
            <h2 className="text-lg font-bold text-blue-600">
              {member.firstName || "Member"} — {member.profession || "Unknown"}
            </h2>

            <p className="text-sm text-gray-700">
              Experience: {member.yearsExperience || member.experience || "0"}{" "}
              years
            </p>

            <p className="text-sm text-gray-700">
              Location: {member.county || member.location || "Unknown"}
            </p>

            <p className="text-sm text-gray-700">
              Property: {member.propertyType || "N/A"} | Project:{" "}
              {member.projectType || "N/A"}
            </p>

            <p className="text-sm text-gray-700">
              Buy-In: up to €{member.buyInTo?.toLocaleString() || "0"}
            </p>

            <p className="text-sm text-gray-700">
              Available from:{" "}
              {member.availability
                ? new Date(member.availability).toLocaleDateString()
                : "TBC"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
