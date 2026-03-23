import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { account } from '../../lib/appwrite';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = 'laboutiquerd_auth';

/**
 * Verifies a real Appwrite session exists before rendering admin routes.
 * Falls back to localStorage only while checking, never trusts it alone.
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    let cancelled = false;

    account.get()
      .then((acc) => {
        if (cancelled) return;
        // Valid session confirmed — update localStorage
        const role = (acc.prefs as any)?.role || 'Vendedor';
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          id: acc.$id, name: acc.name, email: acc.email, role, loggedIn: true
        }));
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        // No valid session — clear stale localStorage
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setStatus('unauthenticated');
      });

    return () => { cancelled = true; };
  }, []);

  if (status === 'checking') {
    // Show a loading spinner while verifying session
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
