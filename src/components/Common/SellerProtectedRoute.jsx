import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { safeJsonParse } from '../../utils/safeJsonParse';

/**
 * Allows access only when localStorage infrioAuth exists AND role === 'seller'.
 */
export default function SellerProtectedRoute({ children }) {
  const location = useLocation();
  const auth = typeof window !== 'undefined' ? safeJsonParse(localStorage.getItem('infrioAuth'), null) : null;

  if (!auth || !auth.role) {
    return <Navigate to="/login" state={{ redirect: location.pathname }} replace />;
  }

  if (auth.role !== 'seller') {
    // Prevent redirect loops: send non-sellers to login (for now).
    return <Navigate to="/login" state={{ redirect: location.pathname }} replace />;
  }

  return children;
}

