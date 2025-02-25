import React, { useState } from "react";
import api from "../../axios";
import { saveAccessToken, saveRefreshToken, saveRole } from "../../utils/authUtils";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new attempt

    try {
      const response = await api.post("api/login", { email, password });

      // Ensure we receive the expected data
      const { accessToken, refreshToken, role } = response.data || {};
      if (!accessToken || !refreshToken || !role) {
        throw new Error("Invalid login response. Missing token or role.");
      }

      // Save token & role
      saveAccessToken(accessToken);
      saveRefreshToken(refreshToken);
      saveRole(role);

      // Set authentication status
      setIsAuthenticated(true);
      setRole(role);

      console.log("Login successful! Role:", role);

      // Redirect based on role after state update
      setLoading(false);
      navigate(role === "admin" ? "/adminDashboard" : "/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
