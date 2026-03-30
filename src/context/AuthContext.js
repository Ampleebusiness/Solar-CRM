import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeJsonParse } from '../utils/safeJsonParse';

const AuthContext = createContext(null);

function readAuthFromStorage() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('infrioAuth');
  return safeJsonParse(raw, null);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => readAuthFromStorage());
  const [sellerRegistrationOpen, setSellerRegistrationOpen] = useState(false);

  useEffect(() => {
    // Keep context in sync if some other part updates localStorage.
    const handler = () => setAuth(readAuthFromStorage());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const openSellerRegistration = () => setSellerRegistrationOpen(true);
  const closeSellerRegistration = () => setSellerRegistrationOpen(false);

  const loginAsSeller = (sellerPayload) => {
    const seller = sellerPayload || {};
    const sellerId = seller.id || String(Date.now());
    const identifier = seller.email || seller.phone || 'seller';

    const authObj = {
      role: 'seller',
      identifier,
      userId: sellerId,
      accessToken: seller.accessToken || '',
      refreshToken: seller.refreshToken || '',
    };

    localStorage.setItem('infrioAuth', JSON.stringify(authObj));
    localStorage.setItem('sellerInfo', JSON.stringify({ ...seller, id: sellerId }));

    setAuth(authObj);
    setSellerRegistrationOpen(false);
    navigate('/seller-dashboard');
  };

  const logout = () => {
    localStorage.removeItem('infrioAuth');
    localStorage.removeItem('sellerInfo');
    localStorage.removeItem('partnerInfo');
    localStorage.removeItem('userInfo');

    setAuth(null);
    setSellerRegistrationOpen(false);
    navigate('/login');
  };

  const value = {
    auth,
    role: auth?.role || null,
    isSeller: auth?.role === 'seller',
    isLoggedIn: !!auth,
    sellerRegistrationOpen,
    openSellerRegistration,
    closeSellerRegistration,
    loginAsSeller,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { AuthContext };

