"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, theme, ConfigProvider } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
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
    <ConfigProvider theme={{
      token: {
        borderRadius: 12,
      },
    }}>
      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            width: '100%',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'static',
          }}
        >
          <h2 style={{
            color: 'inherit',
            marginLeft: '60px',
            height: '64px',
            lineHeight: '64px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}>
            课堂学习分析系统
          </h2>
          <div className="flex items-center pr-6" style={{ marginLeft: 'auto' }}>
            <Dropdown menu={{ items }}>
              <div className="flex cursor-pointer items-center gap-2">
                <Avatar
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  size="default"
                />
                <span style={{ marginRight: '20px' }}>{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Layout style={{ margin: '24px 48px', padding: '12px', background: colorBgContainer, borderRadius: '12px' }}>
          <Sider
            trigger={null}
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRight: '1px solid #f0f0f0',
            }}
          >
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[pathname ? pathname.split('/').slice(0, 2).join('/') : "/"]}
              defaultOpenKeys={[]}
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
                {
                  key: "/teachers",
                  icon: <UserOutlined />,
                  label: <Link href="/teachers">教师信息</Link>,
                },
                {
                  key: "/teaching-quality-analysis",
                  icon: <BarChartOutlined />,
                  label: <Link href="/teaching-quality-analysis">教学质量分析</Link>,
                },
              ]}
              style={{ flex: 1 ,borderRight: 'none'}}
            />

            <div style={{
              position: 'absolute',
              bottom: '24px',
              left:'18px',
              background: 'white',
              zIndex: 1
            }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  width: '48px',
                  color: 'rgba(0, 0, 0, 0.88)'
                }}
              />
            </div>
          </Sider>
          <Content
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              flex: 1,
              overflow: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}