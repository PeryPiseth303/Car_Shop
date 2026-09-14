"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  AuthUser,
  LoginResponseData,
  VerifyOTPResponseData,
  apiLogin,
  apiVerifyOTP,
  apiRegister,
  apiResendOTP,
  apiGetMe,
  apiGetCart,
} from "@/lib/api";
import { ADMIN_EMAIL } from "@/lib/constants";

function syncUserCart(email: string) {
  const normEmail = email.toLowerCase().trim();
  apiGetCart(normEmail)
    .then((cars) => {
      const dbIds = cars.map((c) => String(c.id));
      localStorage.setItem("favorites", JSON.stringify(dbIds));
      localStorage.setItem("cart", JSON.stringify(dbIds));
      window.dispatchEvent(new CustomEvent("local-cars-change", { detail: "favorites" }));
      window.dispatchEvent(new CustomEvent("local-cars-change", { detail: "cart" }));
    })
    .catch((err) => {
      console.warn("Could not sync user cart from DB:", err);
    });
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<LoginResponseData>;
  verifyOTP: (
    email: string,
    code: string,
    purpose?: "login" | "register" | "forgot"
  ) => Promise<VerifyOTPResponseData>;
  register: (
    email: string,
    password: string,
    fullName: string,
    role?: "user" | "admin"
  ) => Promise<LoginResponseData>;
  resendOTP: (
    email: string,
    purpose?: "login" | "register" | "forgot"
  ) => Promise<{ success: boolean; message: string; otp_code?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "aurelia_auth_token";
const USER_KEY = "aurelia_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser?.email) {
          syncUserCart(parsedUser.email);
        }

        // Background refresh user profile from backend
        apiGetMe(savedToken)
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            if (freshUser?.email) {
              syncUserCart(freshUser.email);
            }
          })
          .catch(() => {
            // Token might be expired, clear local storage
            console.warn("Saved token expired or invalid, resetting session");
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
          });
      }
    } catch (e) {
      console.error("Failed to load auth state from local storage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponseData> => {
    return await apiLogin(email, password);
  }, []);

  const verifyOTP = useCallback(
    async (
      email: string,
      code: string,
      purpose: "login" | "register" | "forgot" = "login"
    ): Promise<VerifyOTPResponseData> => {
      const result = await apiVerifyOTP(email, code, purpose);
      setToken(result.access_token);
      setUser(result.user);
      localStorage.setItem(TOKEN_KEY, result.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      if (result.user?.email) {
        syncUserCart(result.user.email);
      }
      return result;
    },
    []
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: "user" | "admin" = "user"
    ): Promise<LoginResponseData> => {
      return await apiRegister(email, password, fullName, role);
    },
    []
  );

  const resendOTP = useCallback(
    async (
      email: string,
      purpose: "login" | "register" | "forgot" = "login"
    ): Promise<{ success: boolean; message: string; otp_code?: string }> => {
      return await apiResendOTP(email, purpose);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("favorites");
    localStorage.removeItem("cart");
    localStorage.removeItem("compare");
    window.dispatchEvent(new CustomEvent("local-cars-change", { detail: "favorites" }));
    window.dispatchEvent(new CustomEvent("local-cars-change", { detail: "cart" }));
    window.dispatchEvent(new CustomEvent("local-cars-change", { detail: "compare" }));
    setToken(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const freshUser = await apiGetMe(token);
      setUser(freshUser);
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [token]);

  const isAuthenticated = !!user && !!token;
  const isAdmin = !!user && user.role === "admin" && user.email?.toLowerCase() === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        verifyOTP,
        register,
        resendOTP,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
