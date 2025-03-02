import React, { useEffect, useState } from "react";
import api from "../axios";
import { getAccessToken, getRefreshToken, saveAccessToken, removeAccessToken, removeRole } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import AdminDashboardChart from "./adminDashboardChart";
import SkeletonReportCard from "../components/util Cards/skeletonReportCard";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchIssues = async () => {
    let token = getAccessToken();

    if (!token) {
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
        const newToken = await handleRefreshToken();
        if (newToken) {
          fetchIssues();
        }
      } else {
        setError(err.response?.data?.error || "Network Error, please refresh.");
        setLoading(false);
      }
    }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        navigate("/login");
        return null;
      }

      const response = await api.post("/api/refresh-token", { token: refreshToken });
      const { accessToken } = response.data;
      if (accessToken) {
        saveAccessToken(accessToken);
        return accessToken;
      } else {
        navigate("/login");
        return null;
      }
    } catch (err) {
      navigate("/login");
      return null;
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = getAccessToken();
      await api.put(`/api/admin/issue/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update issue status.");
    }
  };

  const deleteIssue = async (id) => {
    const value = window.prompt("Enter the passcode to delete:");
    
    if (value === null) {
      window.alert("Deletion cancelled.");
      return;
    }
  
    if (value !== "905705") {
      window.alert("Invalid passcode. Issue not deleted.");
      return;
    }
  
    try {
      const token = getAccessToken();
      await api.delete(`/api/admin/issue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
      window.alert("Issue successfully deleted.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete issue.");
    }
  };

  const handleLogOut = () => {
    removeAccessToken();
    removeRole();
    navigate("/login");
  };

  if (loading) return <SkeletonReportCard />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md p-4 rounded-md mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer mt-2 md:mt-0"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
  <div className="bg-white p-4 rounded-lg shadow-md text-center w-full sm:w-[48%] md:w-[23%]">
    <h2 className="text-gray-600 text-sm">Total Issues</h2>
    <p className="text-xl font-semibold">{issues.length}</p>
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow-md text-center w-full sm:w-[48%] md:w-[23%]">
    <h2 className="text-gray-600 text-sm">Pending</h2>
    <p className="text-xl font-semibold">
      {issues.filter(issue => issue.status === "Reported").length}
    </p>
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow-md text-center w-full sm:w-[48%] md:w-[23%]">
    <h2 className="text-gray-600 text-sm">In Progress</h2>
    <p className="text-xl font-semibold">
      {issues.filter(issue => issue.status === "In Progress").length}
    </p>
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow-md text-center w-full sm:w-[48%] md:w-[23%]">
    <h2 className="text-gray-600 text-sm">Resolved</h2>
    <p className="text-xl font-semibold">
      {issues.filter(issue => issue.status === "Resolved").length}
    </p>
  </div>
</div>


      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">Title</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="border hover:bg-gray-100">
                <td className="p-2">{issue.title}</td>
                <td className="p-2">{issue.user_id?.username || "Unknown"}</td>
                <td className="p-2">{issue.category}</td>
                <td className="p-2">
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue._id, e.target.value)}
                    className="p-1 border w-full md:w-auto"
                  >
                    <option value="Reported">Reported</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteIssue(issue._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer mt-2 md:mt-0"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {issues.length > 0 && <AdminDashboardChart />}
    </div>
  );
};

export default AdminDashboard;
