import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ loggedIn, children, ...props }) => {
  return loggedIn ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
