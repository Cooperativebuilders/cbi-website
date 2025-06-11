import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import TenderTile from "../components/TenderTile";

const TendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tenders"));
        const available = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTenders(available);
      } catch (err) {
        console.error("Error fetching tenders:", err);
      }
    };
    fetchTenders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl">
          ← Back to Dashboard
        </Link>
        <Link
          to="/submit-tender"
          className="text-sm text-blue-500 hover:underline"
        >
          Submit New Tender
        </Link>
      </nav>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">All Tenders</h1>
      {tenders.length === 0 ? (
        <p className="text-gray-600">No tenders available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenders.map((tender) => (
            <div key={tender.id} className="relative">
              <TenderTile tender={tender} tenderId={tender.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TendersPage;