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
        // No active session — check localStorage for offline support
        try {
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.loggedIn) {
              setUser(parsed);
              return;
            }
          }
        } catch (e) { /* ignore */ }
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

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    // Try Appwrite first
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
      window.dispatchEvent(new Event('authChanged'));
      return authUser;
    } catch (err: any) {
      throw new Error(err.message || 'Credenciales inválidas');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession('current');
    } catch (e) { /* session might already be expired */ }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('authChanged'));
  }, []);

  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Gerente' || isAdmin;

  return { user, login, logout, loading, isAdmin, isManager, isAuthenticated: !!user };
};
