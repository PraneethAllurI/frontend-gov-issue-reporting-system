import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../axios";
import { getAccessToken } from "../utils/authUtils";

const AdminDashboardChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssueStats = async () => {
      const token = getAccessToken();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/admin/issues", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const issues = response.data;

        // Process issues by year and status
        const processedData = issues.reduce((acc, issue) => {
          const year = new Date(issue.createdAt).getFullYear();

          if (!acc[year]) {
            acc[year] = { year, total: 0, resolved: 0, pending: 0, reported: 0 };
          }

          acc[year].total += 1;

          if (issue.status === "Resolved") {
            acc[year].resolved += 1;
          } else if (issue.status === "In Progress") {
            acc[year].pending += 1;
          } else {
            acc[year].reported += 1;
          }

          return acc;
        }, {});

        setChartData(Object.values(processedData));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch issue data.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssueStats();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Issue Statistics (Yearly)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total Issues" />
          <Bar dataKey="resolved" fill="#82ca9d" name="Resolved Issues" />
          <Bar dataKey="pending" fill="#ffc658" name="Pending Issues" />
          <Bar dataKey="reported" fill="#ff4d4f" name="Reported Issues" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminDashboardChart;
