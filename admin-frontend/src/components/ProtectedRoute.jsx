/**
 * ProtectedRoute.jsx
 *
 * Route wrapper that enforces authentication. Wrap any <Route> element with
 * this component to ensure only logged-in users can access it.
 *
 * Behaviour:
 *  - While auth state is rehydrating from localStorage → shows "Loading…"
 *  - If no user is authenticated → redirects to /login
 *  - Otherwise → renders the protected children
 *
 * @param {React.ReactNode} children  The route content to protect
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  // `loading` is true during the initial localStorage rehydration on mount
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;