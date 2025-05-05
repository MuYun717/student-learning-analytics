"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getStatistics } from "@/lib/mockData";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const stats = getStatistics();

  // 模拟数据
  const attendanceData: {name: string; 出勤率: number}[] = [
    { name: '周一', 出勤率: 95 },
    { name: '周二', 出勤率: 89 },
    { name: '周三', 出勤率: 92 },
    { name: '周四', 出勤率: 97 },
    { name: '周五', 出勤率: 90 },
  ];

  const qualityData: {name: string; value: number}[] = [
    { name: '优秀', value: 35 },
    { name: '良好', value: 40 },
    { name: '一般', value: 15 },
    { name: '较差', value: 10 },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
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

        <Row gutter={[16, 16]} className="mt-6">
          <Col span={12}>
            <Card title="过去一周出勤率趋势">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="出勤率" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="教学质量分布">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={qualityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-6">
          <Col span={24}>
            <Card title="各课程出勤率对比">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={attendanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#8884d8" name="出勤率(%)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
}