import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loginRequest, logoutRequest, registerRequest } from '../api/authApi';
import type { LoginCredentials } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'e_pharmacy_token';
const EMAIL_KEY = 'e_pharmacy_email';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem(EMAIL_KEY));

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(EMAIL_KEY, result.email);
    setToken(result.token);
    setUserEmail(result.email);
  }, []);

  const register = useCallback(async (credentials: LoginCredentials) => {
    const result = await registerRequest(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(EMAIL_KEY, result.email);
    setToken(result.token);
    setUserEmail(result.email);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setUserEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      userEmail,
      login,
      register,
      logout,
    }),
    [token, userEmail, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
