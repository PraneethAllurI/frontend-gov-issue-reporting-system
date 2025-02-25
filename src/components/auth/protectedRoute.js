import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, role, allowedRole, children }) => {
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
