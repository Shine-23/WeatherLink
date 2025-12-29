import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;
  
  const decoded = jwtDecode(token);
  if (decoded.exp * 1000  < Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
