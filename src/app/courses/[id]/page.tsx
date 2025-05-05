"use client";


import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Typography,
  Button,
  Timeline,
  Tabs,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import {
  EditOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { mockCourses, mockTeachers, mockStudents, Course, Teacher, CourseSchedule } from "@/lib/mockData";

import DashboardLayout from "@/components/layout/DashboardLayout";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CourseDetailPage = () => {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 从模拟数据中获取课程信息
    const foundCourse = mockCourses.find((c) => c.id === params.id);
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [params.id]);

  if (!course) {
    return <div>加载中...</div>;
  }

  const handleEdit = () => {
    form.setFieldsValue({
      ...course,
      dateRange: [dayjs(course.startDate), dayjs(course.endDate)],
      teachers: course.teachers.map((t: Teacher) => t.id),
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;
      
      // 在实际应用中，这里应该调用API更新课程信息
      const updatedCourse = {
        ...course,
        ...values,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        teachers: mockTeachers.filter((t) => values.teachers.includes(t.id)),
      };
      
      setCourse(updatedCourse);
      setIsEditModalOpen(false);
      message.success("课程信息更新成功");
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  const teacherColumns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "职称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "院系",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "联系电话",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];

  const studentColumns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "学号",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "班级",
      dataIndex: "classGroup",
      key: "classGroup",
    },
    {
      title: "联系电话",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "upcoming":
        return "blue";
      case "completed":
        return "gray";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "进行中";
      case "upcoming":
        return "即将开始";
      case "completed":
        return "已结束";
      default:
        return status;
    }
  };

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={2}>{course.name}</Title>
            <Text type="secondary">课程代码: {course.code}</Text>
            <Tag className="ml-4" color={getStatusColor(course.status)}>
              {getStatusText(course.status)}
            </Tag>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            编辑课程
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Text strong>课程描述：</Text>
            <Text>{course.description}</Text>
          </div>
          <div>
            <Text strong>教室：</Text>
            <Text>{course.classroom}</Text>
          </div>
          <div>
            <Text strong>学期：</Text>
            <Text>{course.term}</Text>
          </div>
          <div>
            <Text strong>起止时间：</Text>
            <Text>{`${course.startDate} 至 ${course.endDate}`}</Text>
          </div>
        </div>

        <Title level={4}>课程安排</Title>
        <Timeline
          items={course.schedule.map((schedule: CourseSchedule) => ({
            dot: <ClockCircleOutlined className="text-blue-500" />,
            children: (
              <div>
                <Text strong>{weekDays[schedule.dayOfWeek - 1]}</Text>
                <br />
                <Text>{`${schedule.startTime} - ${schedule.endTime}`}</Text>
              </div>
            ),
          }))}
        />

        <Tabs
          items={[
            {
              key: "1",
              label: (
                <span>
                  <UserOutlined />
                  教师名单
                </span>
              ),
              children: (
                <Table
                  dataSource={course.teachers}
                  columns={teacherColumns}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <TeamOutlined />
                  学生名单
                </span>
              ),
              children: (
                <Table
                  dataSource={course.students}
                  columns={studentColumns}
                  rowKey="id"
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="编辑课程信息"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="课程名称"
            rules={[{ required: true, message: "请输入课程名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="课程代码"
            rules={[{ required: true, message: "请输入课程代码" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="课程描述"
            rules={[{ required: true, message: "请输入课程描述" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="classroom"
            label="教室"
            rules={[{ required: true, message: "请输入教室" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="teachers"
            label="任课教师"
            rules={[{ required: true, message: "请选择任课教师" }]}
          >
            <Select
              mode="multiple"
              placeholder="选择任课教师"
              options={mockTeachers.map((teacher) => ({
                label: `${teacher.name} (${teacher.title})`,
                value: teacher.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="term"
            label="学期"
            rules={[{ required: true, message: "请输入学期" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="起止时间"
            rules={[{ required: true, message: "请选择起止时间" }]}
          >
            <RangePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseDetailPage;