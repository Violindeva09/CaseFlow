import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Case 1: No user logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Case 2: User logged in but not authorized for this role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Case 3: User authorized — render the child component
  return children;
};

export default ProtectedRoute;
