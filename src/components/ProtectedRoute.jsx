import { Navigate, Outlet } from "react-router";

function ProtectedRoute({ session }) {
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;