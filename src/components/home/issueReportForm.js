import React, { useState } from "react";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

const IssueReportForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const token = getAccessToken();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    const data = {
      title: title,
      description: description,
      category: category,
      location: location,
    };
    if (image) {
      data.image = image;
    }

    console.log(data);
    try {
      await api.post("/api/issues/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      
      alert("Issue Reported Successfully");
      setCategory("");
      setDescription("");
      setError("");
      setImage(null);
      setLocation("");
      setTitle("");
      navigate("/dashboard"); // Redirect to dashboard after submission
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(
          error.response.data.error || "An error occurred. Please try again."
        );
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Report an Issue</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700">
            Category
          </label>
          <select
            id="category"
            className="w-full p-2 border border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Public Services">Public Services</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Law Enforcement">Law Enforcement</option>
            <option value="Environmental">Environmental</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="w-full p-2 border border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex-grow">
            <label htmlFor="image" className="block text-gray-700">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleFileChange}
            />
          </div>
          <button
            onClick={handleRemoveImage}
            className="bg-red-500 text-white p-2 rounded"
          >
            Remove Image
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p className="mt-2">Submitting, please wait...</p>
          </div>
        </div>
      )}
      {/* {success.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p className="mt-2">{success}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default IssueReportForm;
