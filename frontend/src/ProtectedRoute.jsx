import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // Redirect to login if there is no user
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
