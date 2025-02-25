import React, { useEffect, useState } from "react";
import api from "../axios";
import { getAccessToken, getRefreshToken, saveAccessToken, removeAccessToken, removeRole } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import AdminDashboardChart from "./adminDashboardChart";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchIssues = async () => {
    let token = getAccessToken();
    console.log(token) // Get token inside function

    if (!token) {
      console.log("No token found");
      setError("Please login first. Redirecting to login page...");
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/admin/issues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Access token expired. Trying refresh...");
        await handleRefreshToken();
      } else {
        console.error("Error fetching issues:", err);
        setError(err.response?.data?.error || "Failed to fetch issues.");
        setLoading(false);
      }
    }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.error("No refresh token found.");
        navigate("/login");
        return;
      }

      const response = await api.post("/api/refresh-token", { token: refreshToken });
      const { accessToken } = response.data;
      if (accessToken) {
        saveAccessToken(accessToken);
        fetchIssues(); // Retry fetching issues with new token
      } else {
        console.error("Failed to refresh token.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Refresh token request failed:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []); // No need to include `navigate` or `token` in dependencies

  const updateStatus = async (id, newStatus) => {
    try {
      const token = getAccessToken(); // Get the latest token
      await api.put(`/api/admin/issue/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.error || "Failed to update issue status.");
    }
  };

  const deleteIssue = async (id) => {
    try {
      const token = getAccessToken(); // Get the latest token
      await api.delete(`/api/admin/issue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert(err.response?.data?.error || "Failed to delete issue.");
    }
  };

  const handleLogOut = () => {
    console.log('Logging out...');
        removeAccessToken();
        removeRole();
        navigate('/login');
  }

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
        <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button 
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
      onClick={handleLogOut}>Logout</button>
        </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id} className="border">
              <td className="p-2">{issue.title}</td>
              <td className="p-2">{issue.user_id?.username || "Unknown"}</td>
              <td className="p-2">{issue.category}</td>
              <td className="p-2">
                <select
                  value={issue.status}
                  onChange={(e) => updateStatus(issue._id, e.target.value)}
                  className="p-1 border"
                >
                  <option value="Reported">Reported</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteIssue(issue._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminDashboardChart />
    </div>
  );
};

export default AdminDashboard;
