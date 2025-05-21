"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginResponse } from "@/types";
import { authAPI } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 检查本地存储中的用户信息
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // 验证token是否有效
          const currentUser = await authAPI.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // token无效，清除本地存储
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("验证用户状态失败:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("尝试登录:", email);
      
      const result = await authAPI.login(email, password);
      console.log("登录结果:", result);
      
      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          name: result.user.name,
          role: result.user.role,
          email: result.user.email,
        };
        
        // 保存token和用户信息
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("设置用户状态:", userData);
        setUser(userData);
      } else {
        setError(result.message || "登录失败，请检查您的凭据");
        console.error("登录失败:", result.message);
      }
    } catch (err) {
      setError("登录失败，请检查您的凭据");
      console.error("登录错误:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("登出错误:", error);
    } finally {
      // 无论API调用是否成功，都清除本地存储和状态
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
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