"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, Input, Select, Row, Col, Button, Tag, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { mockCourses } from "@/lib/mockData";
import Link from "next/link";

const { Search } = Input;

export default function CoursesPage() {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filteredCourses = mockCourses.filter(course => {
    const matchSearch = course.name.toLowerCase().includes(searchText.toLowerCase()) ||
                       course.code.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = status === "all" ? true : course.status === status;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "upcoming":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "进行中";
      case "completed":
        return "已结束";
      case "upcoming":
        return "即将开始";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">课程管理</h2>
          <Button type="primary" icon={<PlusOutlined />}>
            新增课程
          </Button>
        </div>

        <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          <Search
            placeholder="搜索课程名称或编号"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Select
            style={{ width: 120 }}
            value={status}
            onChange={value => setStatus(value)}
            options={[
              { value: "all", label: "全部状态" },
              { value: "active", label: "进行中" },
              { value: "completed", label: "已结束" },
              { value: "upcoming", label: "即将开始" },
            ]}
          />
        </div>

        <Row gutter={[16, 16]}>
          {filteredCourses.map(course => (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Link href={`/courses/${course.id}`}>
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{course.code}</span>
                    </div>
                  }
                >
                  <Card.Meta
                    title={course.name}
                    description={
                      <Space direction="vertical" className="w-full">
                        <div className="text-gray-500 text-sm">{course.description.slice(0, 50)}...</div>
                        <div className="flex justify-between items-center">
                          <Tag color={getStatusColor(course.status)}>{getStatusText(course.status)}</Tag>
                          <span className="text-sm text-gray-500">
                            {course.students.length}名学生
                          </span>
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </DashboardLayout>
  );
} 