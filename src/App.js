import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/login";
import UserDashboard from "./components/home/userDashboard";
import Signup from "./components/auth/singUp";
import NotFound from "./components/auth/notFound";
import AdminDashboard from "./admin/adminDashboard";
import { getAccessToken, getRole } from "./utils/authUtils";
import ProtectedRoute from "./components/auth/protectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    const userRole = getRole();

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, [isAuthenticated]); // Re-run when auth state changes

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
        <Route path="/register" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} allowedRole="citizen">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Root Path Redirection */}
        <Route
          path="/"
          element={
            isAuthenticated === null ? (
              <div>Loading...</div>
            ) : isAuthenticated ? (
              role === "admin" ? <Navigate to="/adminDashboard" /> : <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
