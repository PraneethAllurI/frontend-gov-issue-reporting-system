import React, { useEffect, useState } from "react";
import api from "../../axios";
import { getAccessToken } from "../../utils/authUtils";
import ReportCard from "../util Cards/reportCard";
import SkeletonReportCard from "../util Cards/skeletonReportCard";

const ShowReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getAccessToken();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userResponse = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.data || !userResponse.data._id) {
          throw new Error("User ID not found");
        }

        const response = await api.get(`/api/issues/user/${userResponse.data._id}`);
        setReports(response.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.response?.data?.error || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  // Filter issues by status
  const reportedIssues = reports.filter((report) => report.status === "Reported");
  const inProgressIssues = reports.filter((report) => report.status === "In Progress");
  const resolvedIssues = reports.filter((report) => report.status === "Resolved");

  return (
    <div>
      <h2 className="text-2xl mb-4">Reported Issues</h2>

      {loading ? (
        <div className="space-y-4">
          <SkeletonReportCard />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <div className="space-y-8">
          {/* Reported Issues Section */}
          {reportedIssues.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">🛑 Reported Issues</h3>
              <ul className="space-y-4">
                {reportedIssues.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </ul>
            </div>
          )}

          {/* In Progress Issues Section */}
          {inProgressIssues.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">⏳ In Progress</h3>
              <ul className="space-y-4">
                {inProgressIssues.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </ul>
            </div>
          )}

          {/* Resolved Issues Section */}
          {resolvedIssues.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">✅ Resolved</h3>
              <ul className="space-y-4">
                {resolvedIssues.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowReports;
