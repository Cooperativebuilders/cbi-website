// src/pages/MembersPage.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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
        setMembers(data);
      } catch (error) {
        console.error("Error fetching member profiles:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        CBI Member Directory
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold text-blue-600 mb-2">
              {member.firstName} — {member.profession}
            </h2>
            <p className="text-sm text-gray-700 mb-1">
              Experience: {member.yearsExperience} years
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Location: {member.county || member.location}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Property: {member.propertyType} | Project: {member.projectType}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Buy-In: up to €{member.buyInTo?.toLocaleString()}
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
