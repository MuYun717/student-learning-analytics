"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { getStatistics } from "@/lib/mockData";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const stats = getStatistics();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">欢迎回来，{user.name}！</h2>
          <p className="text-gray-600">
            这里是学生课堂学习质量分析系统的控制面板，您可以在这里查看课程数据统计和学生学习情况。
          </p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={6}>
            <Card>
              <Statistic
                title="课程总数"
                value={stats.totalCourses}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card>
              <Statistic
                title="进行中课程"
                value={stats.activeCourses}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card>
              <Statistic
                title="学生总数"
                value={stats.totalStudents}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card>
              <Statistic
                title="教师总数"
                value={stats.totalTeachers}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
} 