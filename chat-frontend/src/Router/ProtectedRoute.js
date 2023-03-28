import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth.userToken);

  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  // return <Outlet />;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
