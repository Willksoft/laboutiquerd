import { useState, useEffect, useCallback } from 'react';
import { account } from '../lib/appwrite';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  loggedIn: boolean;
}

const AUTH_STORAGE_KEY = 'laboutiquerd_auth';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttempts {
  count: number;
  lastAttempt: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.loggedIn) return parsed;
      }
    } catch (e) { /* ignore */ }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Check if there's an active Appwrite session on mount
  useEffect(() => {
    account.get()
      .then(async (acc) => {
        const role = (acc.prefs as any)?.role || 'Vendedor';
        const authUser: AuthUser = {
          id: acc.$id,
          name: acc.name,
          email: acc.email,
          role,
          loggedIn: true,
        };
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      })
      .catch(() => {
        // No valid Appwrite session — clear any stale localStorage data
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for auth changes from other components
  useEffect(() => {
    const handleChange = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.loggedIn ? parsed : null);
        } else {
          setUser(null);
        }
      } catch (e) { setUser(null); }
    };
    window.addEventListener('authChanged', handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener('authChanged', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  const [loginAttempts, setLoginAttempts] = useState<LoginAttempts>(() => {
    try {
      const stored = localStorage.getItem('laboutiquerd_login_attempts');
      return stored ? JSON.parse(stored) : { count: 0, lastAttempt: 0 };
    } catch { return { count: 0, lastAttempt: 0 }; }
  });

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    // — Brute-force protection —
    const now = Date.now();
    const timeSinceLast = now - loginAttempts.lastAttempt;
    const currentAttempts = timeSinceLast > LOCKOUT_DURATION_MS ? 0 : loginAttempts.count;

    if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
      const remaining = Math.ceil((LOCKOUT_DURATION_MS - timeSinceLast) / 60000);
      throw new Error(`Demasiados intentos fallidos. Espera ${remaining} minuto${remaining !== 1 ? 's' : ''} antes de intentar de nuevo.`);
    }

    // Try Appwrite session
    try {
      await account.createEmailPasswordSession(email, password);
      const acc = await account.get();
      const role = acc.prefs?.role || 'Vendedor';
      const authUser: AuthUser = {
        id: acc.$id,
        name: acc.name,
        email: acc.email,
        role,
        loggedIn: true,
      };
      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      // Reset attempts on success
      setLoginAttempts({ count: 0, lastAttempt: 0 });
      localStorage.removeItem('laboutiquerd_login_attempts');
      window.dispatchEvent(new Event('authChanged'));
      return authUser;
    } catch (err: any) {
      // Track failed attempt
      const failedAttempts: LoginAttempts = { count: currentAttempts + 1, lastAttempt: Date.now() };
      setLoginAttempts(failedAttempts);
      localStorage.setItem('laboutiquerd_login_attempts', JSON.stringify(failedAttempts));
      const left = MAX_LOGIN_ATTEMPTS - failedAttempts.count;
      const suffix = left > 0 ? ` (${left} intento${left !== 1 ? 's' : ''} restante${left !== 1 ? 's' : ''})` : '';
      throw new Error((err.message || 'Credenciales inválidas') + suffix);
    }
  }, [loginAttempts]);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession('current');
    } catch (e) { /* session might already be expired */ }
    setUser(null);
    // Clear auth token
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Clear all operational cache keys (sensitive customer/order data)
    const sensitiveKeys = [
      'laboutiquerd_orders',
      'laboutiquerd_reservations',
      'laboutiquerd_blocked_times',
      'laboutiquerd_blocked_days',
      'laboutiquerd_blocked_hours',
      'laboutiquerd_custom_hours',
      'laboutiquerd_vendors',
      'laboutiquerd_login_attempts',
    ];
    sensitiveKeys.forEach(key => localStorage.removeItem(key));
    window.dispatchEvent(new Event('authChanged'));
  }, []);

  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Gerente' || isAdmin;

  return { user, login, logout, loading, isAdmin, isManager, isAuthenticated: !!user };
};
