import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const expMs = (decoded?.exp || 0) * 1000;
    return expMs > Date.now();
  } catch {
    return false;
  }
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    clearAuth();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
