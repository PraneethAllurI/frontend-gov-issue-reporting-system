import React, { useEffect, useState } from "react";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import { getAccessToken, saveAccessToken } from "../../utils/authUtils";
import Navbar from "./navbar";

function UserDashboard() {
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      let token = getAccessToken();

      if (!token) {
        setError("Please Login first, redirecting to Login Page...");
        setLoading(false);
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      try {
        const response = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // 🔥 Try refreshing the token first
          try {
            const refreshRes = await api.post("/api/refresh-token", {}, { withCredentials: true });
            console.log(refreshRes.data.accessToken)
            if (refreshRes.data.accessToken) {
              saveAccessToken(refreshRes.data.accessToken); // Save new token
              token = refreshRes.data.accessToken; // Update token variable

              // 🔥 Retry the original request with the new token
              const retryResponse = await api.get("/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
              });
              setData(retryResponse.data);
            } else {
              throw new Error("No access token received after refresh.");
            }
          } catch (refreshError) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            setTimeout(() => navigate("/login"), 1000);
          }
        } else {
          setError("Error fetching user data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // ✅ No `navigate` dependency to prevent infinite loop

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1 className="text-red-500">{error}</h1>;

  return (
    <div>
      <Navbar username={data?.username || "User"} />
    </div>
  );
}

export default UserDashboard;
