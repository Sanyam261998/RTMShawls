// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/" />;
  if (adminOnly && user.username !== "admin") return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;
