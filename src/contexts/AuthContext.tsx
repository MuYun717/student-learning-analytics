"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { User } from "@/types";
import { loginMock, LoginResponse } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 确保在客户端环境中执行
    if (typeof window !== 'undefined') {
      // 检查本地存储中是否有用户信息
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Found stored user:", parsedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error parsing stored user:", err);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting login with:", email);
      
      // 显式指定 loginMock 返回类型
      const result: LoginResponse = loginMock({ email, password });
      console.log("Login result:", result);
      
      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          name: result.user.name,
          role: result.user.role,
          email: result.user.email,
        };
        
        // 确保在客户端环境中执行
        if (typeof window !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        console.log("Setting user in state:", userData);
        setUser(userData);
      } else {
        setError(result.message || "登录失败，请检查您的凭据");
        console.error("Login failed:", result.message);
      }
    } catch (err) {
      setError("登录失败，请检查您的凭据");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // 清除本地存储和状态
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 