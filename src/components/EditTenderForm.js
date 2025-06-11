import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditTenderForm = () => {
  const [user] = useAuthState(auth);
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchTender = async () => {
      const docRef = doc(db, "tenders", tenderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    };
    fetchTender();
  }, [tenderId]);

  if (!formData) return <div>Loading...</div>;
  if (user?.uid !== formData.postedBy) return <div>Not authorized.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "tenders", tenderId), {
      ...formData,
    });
    alert("Tender updated!");
    navigate("/tenders");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Tender</h2>
      <input
        name="title"
        placeholder="Tender Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <textarea
        name="description"
        placeholder="Tender Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
      {/* ...repeat for other fields... */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditTenderForm;