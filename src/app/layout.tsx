"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "./globals.css";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  if (pathname === "/login" ) {
    return (
      <html lang="zh-CN" className="h-screen">
        <body id="root" style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
          <StyledComponentsRegistry>
            <AuthProvider>{children}</AuthProvider>
          </StyledComponentsRegistry>
        </body>
      </html>
    );
  }
  return (
    <html lang="zh-CN" className="h-screen">
      <body id="root" style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}