"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const items = [
    {
      key: "1",
      label: <span>个人信息</span>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <span>退出登录</span>,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ maxHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <h1 className="ml-10 truncate" style={{ 
            color: 'white',
            marginLeft: '20px',
            height: '64px',
            lineHeight: '64px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }}>
            {collapsed ? "智学" : "课堂学习分析系统"}
        </h1>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname ?? "/"]}
          defaultOpenKeys={["courses"]}
          items={[
            {
              key: "/",
              icon: <DashboardOutlined />,
              label: <Link href="/">首页</Link>,
            },
            {
              key: "/courses",
              icon: <BookOutlined />,
              label: <Link href="/courses">课程管理</Link>,
            },
            {
              key: "/students",
              icon: <TeamOutlined />,
              label: <Link href="/students">学生管理</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 230, transition: "all 0.2s" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 9,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <div className="flex items-center pr-6">
            <Dropdown menu={{ items }}>
              <div className="flex cursor-pointer items-center gap-2">
                <Avatar
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  size="default"
                />
                <span style={{marginRight: '20px'}}>{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 