import React, { useEffect, useState } from "react";
import api from "../../axios";
import { getAccessToken } from "../../utils/authUtils";
import ReportCard from "../util Cards/reportCard";
import SkeletonReportCard from "../util Cards/skeletonReportCard"; // Import Skeleton Loader

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
        setError("An error occurred while fetching reports.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchReports();
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Reported Issues</h2>
      <div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <SkeletonReportCard key={index} />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShowReports;
