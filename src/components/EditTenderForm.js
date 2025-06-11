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
  const [asap, setAsap] = useState(false);

  useEffect(() => {
    const fetchTender = async () => {
      const docRef = doc(db, "tenders", tenderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(data);
        setAsap(data.startDate === "ASAP");
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

  const handleAsapChange = (e) => {
    const checked = e.target.checked;
    setAsap(checked);
    setFormData((prev) => ({
      ...prev,
      startDate: checked ? "ASAP" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If not ASAP, ensure startDate is set
    if (!asap && !formData.startDate) {
      alert("Please select a start date or choose ASAP.");
      return;
    }
    try {
      await updateDoc(doc(db, "tenders", tenderId), {
        ...formData,
        startDate: asap ? "ASAP" : formData.startDate,
        budget: parseInt(formData.budget, 10) || 0,
      });
      alert("Tender updated!");
      navigate("/tenders");
    } catch (err) {
      alert("Failed to update tender.");
      console.error(err);
    }
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
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="Labour Only">Labour Only</option>
        <option value="Labour & Materials">Labour & Materials</option>
      </select>
      <label className="block mb-1 font-medium text-gray-700" htmlFor="startDate">
        Start Date
      </label>
      <div className="flex items-center mb-4">
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={asap ? "" : (formData.startDate === "ASAP" ? "" : formData.startDate)}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={asap}
          required={!asap}
          style={{ maxWidth: "200px" }}
        />
        <label className="ml-4 flex items-center">
          <input
            type="checkbox"
            checked={asap}
            onChange={handleAsapChange}
            className="mr-2"
          />
          ASAP
        </label>
      </div>
      <label className="block mb-1 font-medium text-gray-700" htmlFor="deadline">
        Deadline
      </label>
      <input
        type="date"
        id="deadline"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        name="budget"
        placeholder="Budget (€)"
        value={formData.budget}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
        type="number"
        min="0"
      />
      <input
        name="contact"
        placeholder="Contact Information"
        value={formData.contact}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
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