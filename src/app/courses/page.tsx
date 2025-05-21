"use client";

import { useState, useEffect } from "react";
import { Card, Input, Select, Row, Col, Button, Tag, Space, Form, Modal, DatePicker, TimePicker, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";

const { Search } = Input;
const { RangePicker } = DatePicker;

interface CourseSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Teacher {
  id: string;
  name: string;
  title: string;
  department: string;
  phoneNumber: string;
}

interface Course {
  id: string;
  name: string;
  teacher: Teacher;
  schedule: CourseSchedule[];
  students: string[];
  camera_url: string;
  detail: string;
  class_room: string;
  term: string;
  start_date: string;
  end_date: string;
}

export default function CoursesPage() {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [schedules, setSchedules] = useState<CourseSchedule[]>([{ dayOfWeek: 1, startTime: "08:00", endTime: "10:00" }]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://course-inspection.wjunzs.com:8080/course/list');
      if (!response.ok) {
        throw new Error('获取课程列表失败');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('获取课程列表错误:', error);
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 当前仅使用课程名称进行筛选，后续可以扩展筛选条件
  const filteredCourses = courses?.filter(course => {
    const matchSearch = course.name.toLowerCase().includes(searchText.toLowerCase());
    return matchSearch;
  }) || [];

  const handleCreateCourse = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理日期格式
      const { course_date, ...restValues } = values;
      const start_date = course_date[0].format('YYYY-MM-DD');
      const end_date = course_date[1].format('YYYY-MM-DD');
      
      // 处理授课时间格式
      const formattedSchedules = schedules.map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime
      }));

      // 构建要提交的数据
      const courseData = {
        id: values.id || `c${Date.now()}`, // 使用用户输入的ID，如果没有则生成一个临时ID
        name: values.name,
        teacher: {
          id: values.teacher_id,
          name: values.teacher_name,
          title: values.teacher_title,
          department: values.teacher_department,
          phoneNumber: values.teacher_phone
        },
        schedule: formattedSchedules,
        students: [], // 新建课程默认没有学生
        camera_url: values.camera_url,
        detail: values.detail,
        class_room: values.class_room,
        term: values.term,
        start_date,
        end_date
      };

      // 发送创建课程请求
      const response = await fetch('http://course-inspection.wjunzs.com:8080/course/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        throw new Error('创建课程失败');
      }

      message.success('创建课程成功');
      setIsModalVisible(false);
      form.resetFields();
      setSchedules([{ dayOfWeek: 1, startTime: "08:00", endTime: "10:00" }]);
      fetchCourses(); // 重新获取课程列表
    } catch (error) {
      console.error('创建课程错误:', error);
      message.error('创建课程失败，请检查表单');
    }
  };

  const addSchedule = () => {
    setSchedules([...schedules, { dayOfWeek: 1, startTime: "08:00", endTime: "10:00" }]);
  };

  const removeSchedule = (index: number) => {
    if (schedules.length > 1) {
      const newSchedules = [...schedules];
      newSchedules.splice(index, 1);
      setSchedules(newSchedules);
    }
  };

  const updateSchedule = (index: number, field: keyof CourseSchedule, value: any) => {
    const newSchedules = [...schedules];
    if (field === 'startTime' || field === 'endTime') {
      newSchedules[index][field] = value.format('HH:mm');
    } else {
      newSchedules[index][field] = value;
    }
    setSchedules(newSchedules);
  };

  // 根据日期计算课程状态
  const getCourseStatus = (start_date: string, end_date: string): string => {
    const today = dayjs();
    const startDate = dayjs(start_date);
    const endDate = dayjs(end_date);
    
    if (today.isBefore(startDate)) {
      return "upcoming";
    } else if (today.isAfter(endDate)) {
      return "completed";
    } else {
      return "active";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "gray";
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">课程管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            新增课程
          </Button>
        </div>

        <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          <Search
            placeholder="搜索课程名称"
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
          {filteredCourses.map(course => {
            const courseStatus = getCourseStatus(course.start_date, course.end_date);
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <Link href={`/courses/${course.id}`}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{course.name}</span>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={course.name}
                      description={
                        <Space direction="vertical" className="w-full">
                          <div className="text-gray-500 text-sm">{course.detail?.slice(0, 50)}...</div>
                          <div className="flex justify-between items-center">
                            <Tag color={getStatusColor(courseStatus)}>{getStatusText(courseStatus)}</Tag>
                            <span className="text-sm text-gray-500">
                              {course.students?.length || 0}名学生
                            </span>
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            )
          })}
        </Row>

        {/* 创建课程表单 */}
        <Modal
          title="创建新课程"
          open={isModalVisible}
          onOk={handleCreateCourse}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              teacher_id: "teacher-1",
              camera_url: "rtsp://example.com/camera"
            }}
          >
            <Form.Item
              name="id"
              label="课程ID"
              rules={[{ required: false, message: "请输入课程ID（可选）" }]}
            >
              <Input placeholder="如不填写将自动生成" />
            </Form.Item>
            
            <Form.Item
              name="name"
              label="课程名称"
              rules={[{ required: true, message: "请输入课程名称" }]}
            >
              <Input placeholder="请输入课程名称" />
            </Form.Item>

            <Form.Item label="任课教师信息">
              <Input.Group compact>
                <Form.Item
                  name="teacher_id"
                  noStyle
                  rules={[{ required: true, message: "请输入教师ID" }]}
                >
                  <Input style={{ width: '15%' }} placeholder="教师ID" />
                </Form.Item>
                <Form.Item
                  name="teacher_name"
                  noStyle
                  rules={[{ required: true, message: "请输入教师姓名" }]}
                >
                  <Input style={{ width: '20%' }} placeholder="教师姓名" />
                </Form.Item>
                <Form.Item
                  name="teacher_title"
                  noStyle
                  rules={[{ required: true, message: "请输入教师职称" }]}
                >
                  <Input style={{ width: '15%' }} placeholder="职称" />
                </Form.Item>
                <Form.Item
                  name="teacher_department"
                  noStyle
                  rules={[{ required: true, message: "请输入所属院系" }]}
                >
                  <Input style={{ width: '25%' }} placeholder="所属院系" />
                </Form.Item>
                <Form.Item
                  name="teacher_phone"
                  noStyle
                  rules={[{ required: true, message: "请输入联系电话" }]}
                >
                  <Input style={{ width: '25%' }} placeholder="联系电话" />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="class_room"
              label="教室"
              rules={[{ required: true, message: "请输入教室" }]}
            >
              <Input placeholder="如：教室A101" />
            </Form.Item>

            <Form.Item
              name="term"
              label="学期"
              rules={[{ required: true, message: "请输入学期" }]}
            >
              <Input placeholder="如：2023-秋季" />
            </Form.Item>

            <Form.Item
              name="course_date"
              label="课程起止日期"
              rules={[{ required: true, message: "请选择课程起止日期" }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="授课时间安排">
              {schedules.map((schedule, index) => (
                <div key={index} className="flex mb-2 items-center">
                  <Select
                    value={schedule.dayOfWeek}
                    onChange={(value) => updateSchedule(index, 'dayOfWeek', value)}
                    style={{ width: 100 }}
                  >
                    <Select.Option value={1}>周一</Select.Option>
                    <Select.Option value={2}>周二</Select.Option>
                    <Select.Option value={3}>周三</Select.Option>
                    <Select.Option value={4}>周四</Select.Option>
                    <Select.Option value={5}>周五</Select.Option>
                    <Select.Option value={6}>周六</Select.Option>
                    <Select.Option value={7}>周日</Select.Option>
                  </Select>
                  <TimePicker
                    format="HH:mm"
                    value={dayjs(schedule.startTime, 'HH:mm')}
                    onChange={(value) => updateSchedule(index, 'startTime', value)}
                    className="ml-2"
                  />
                  <span className="mx-2">至</span>
                  <TimePicker
                    format="HH:mm"
                    value={dayjs(schedule.endTime, 'HH:mm')}
                    onChange={(value) => updateSchedule(index, 'endTime', value)}
                  />
                  <Button
                    danger
                    type="link"
                    onClick={() => removeSchedule(index)}
                    disabled={schedules.length <= 1}
                    className="ml-2"
                  >
                    删除
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={addSchedule} block>
                添加授课时间
              </Button>
            </Form.Item>

            <Form.Item
              name="camera_url"
              label="摄像头URL"
              rules={[{ required: true, message: "请输入摄像头URL" }]}
            >
              <Input placeholder="如：rtsp://example.com/camera" />
            </Form.Item>

            <Form.Item
              name="detail"
              label="课程详细描述"
              rules={[{ required: true, message: "请输入课程详细描述" }]}
            >
              <Input.TextArea rows={4} placeholder="请输入课程详细描述" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
} 