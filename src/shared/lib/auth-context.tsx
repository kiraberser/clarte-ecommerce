"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, LoginData, RegisterData } from "@/shared/types/api";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getProfile,
  refreshAccessToken,
} from "@/shared/lib/services/auth";
import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "@/shared/lib/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      // Try refresh
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          await refreshAccessToken(refresh);
          const profile = await getProfile();
          setUser(profile);
        } catch {
          clearTokens();
          setUser(null);
        }
      } else {
        clearTokens();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (credentials: LoginData) => {
    await loginService(credentials);
    const profile = await getProfile();
    setUser(profile);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await registerService(data);
    const profile = await getProfile();
    setUser(profile);
  }, []);

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      await logoutService(refresh);
    } else {
      clearTokens();
    }
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await getProfile();
    setUser(profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
