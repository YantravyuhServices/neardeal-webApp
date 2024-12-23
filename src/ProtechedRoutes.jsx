import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ Component, isUserLoggedIn }) => {
  // If user is logged in, render the component, otherwise redirect to sign-in page
  return isUserLoggedIn ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;