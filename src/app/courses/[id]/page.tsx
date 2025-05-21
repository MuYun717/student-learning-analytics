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
  Badge,
  Descriptions,
  Space,
} from "antd";
import {
  EditOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { mockCourses, mockTeachers, mockStudents, Course, Teacher, CourseSchedule } from "@/lib/mockData";
import { courseRecordAPI } from "@/lib/api";
import { CourseRecord } from "@/types";

import DashboardLayout from "@/components/layout/DashboardLayout";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CourseDetailPage = () => {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseRecords, setCourseRecords] = useState<CourseRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 从模拟数据中获取课程信息
    const foundCourse = mockCourses.find((c) => c.id === params.id);
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [params.id]);

  // 获取课程记录数据
  useEffect(() => {
    if (params.id) {
      fetchCourseRecords(params.id as string);
    }
  }, [params.id]);

  // 检查课程记录中是否有正在进行的监控
  useEffect(() => {
    const hasActiveMonitoring = courseRecords.some(record => record.detecting === true);
    setIsMonitoring(hasActiveMonitoring);
  }, [courseRecords]);

  // 获取课程记录
  const fetchCourseRecords = async (courseId: string) => {
    try {
      setRecordsLoading(true);
      const records = await courseRecordAPI.getCourseRecords(courseId);
      setCourseRecords(records);
    } catch (error) {
      console.error("获取课程记录失败:", error);
      message.error("获取课程记录失败");
    } finally {
      setRecordsLoading(false);
    }
  };

  // 开始课程监控
  const startMonitoring = async () => {
    if (!course) return;
    
    try {
      setMonitoringLoading(true);
      
      const formData = new FormData();
      formData.append('id', course.id);
      
      const response = await fetch('http://course-inspection.wjunzs.com:8080/course/startMonitoring', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      message.success("课程监控已开始");
      // 刷新课程记录
      await fetchCourseRecords(course.id);
    } catch (error) {
      console.error("开始课程监控失败:", error);
      message.error("开始课程监控失败");
    } finally {
      setMonitoringLoading(false);
    }
  };
  
  // 结束课程监控
  const stopMonitoring = async () => {
    if (!course) return;
    
    try {
      setMonitoringLoading(true);
      
      const formData = new FormData();
      formData.append('id', course.id);
      
      const response = await fetch('http://course-inspection.wjunzs.com:8080/course/stopMonitoring', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      message.success("课程监控已结束");
      // 刷新课程记录
      await fetchCourseRecords(course.id);
    } catch (error) {
      console.error("结束课程监控失败:", error);
      message.error("结束课程监控失败");
    } finally {
      setMonitoringLoading(false);
    }
  };

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

  // 课堂记录表格列定义
  const recordColumns = [
    {
      title: "记录ID",
      dataIndex: "record_id",
      key: "record_id",
      width: 250,
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "create_at",
      key: "create_at",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "教师",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "状态",
      dataIndex: "detecting",
      key: "detecting",
      render: (detecting: boolean) => detecting ? (
        <Badge status="processing" text={<span style={{ color: "#1890ff" }}>进行中</span>} />
      ) : (
        <Badge status="success" text="已完成" />
      ),
    },
    {
      title: "出勤情况",
      key: "attendance",
      render: (_: any, record: CourseRecord) => {
        const totalStudents = record.students.length;
        const attendCount = record.attendees.length;
        const attendRate = totalStudents > 0 ? Math.round((attendCount / totalStudents) * 100) : 0;
        
        return (
          <Space>
            <Tag color="green">{`出勤: ${attendCount}/${totalStudents}`}</Tag>
            <Tag color={attendRate >= 80 ? "green" : attendRate >= 60 ? "orange" : "red"}>
              {`${attendRate}%`}
            </Tag>
          </Space>
        );
      }
    },
  ];

  // 课堂记录展开行内容
  const expandedRowRender = (record: CourseRecord) => {
    // 找出所有学生的详细信息
    const studentMap = new Map();
    mockStudents.forEach(student => {
      studentMap.set(student.id, student);
    });

    // 计算学生出勤状态
    const studentStatus = record.students.map(studentId => {
      const student = studentMap.get(studentId) || { id: studentId, name: "未知学生" };
      const isAttend = record.attendees.includes(studentId);
      const isLatecomer = record.latecomer.includes(studentId);
      const isEarlyLeaver = record.early_leaver.includes(studentId);
      
      // 如果学生既不在出勤、迟到和早退名单中，则标记为缺勤
      const isAbsent = !isAttend && !isLatecomer && !isEarlyLeaver;

      return {
        key: studentId,
        id: studentId,
        name: student.name,
        isAttend,
        isLatecomer,
        isEarlyLeaver,
        isAbsent
      };
    });

    // 学生出勤状态列
    const studentStatusColumns = [
      { title: "学号", dataIndex: "id", key: "id" },
      { title: "姓名", dataIndex: "name", key: "name" },
      { 
        title: "状态", 
        key: "status",
        render: (_: any, record: any) => (
          <Space>
            {record.isAbsent && 
              <Tag color="red" icon={<CloseCircleOutlined />}>缺勤</Tag>
            }
            {record.isAttend && !record.isAbsent && 
              <Tag color="green" icon={<CheckCircleOutlined />}>出勤</Tag>
            }
            {record.isLatecomer && !record.isAbsent && 
              <Tag color="orange" icon={<ClockCircleOutlined />}>迟到</Tag>
            }
            {record.isEarlyLeaver && !record.isAbsent && 
              <Tag color="orange" icon={<ClockCircleOutlined />}>早退</Tag>
            }
          </Space>
        )
      }
    ];

    // 统计各种状态的学生人数
    const totalStudents = record.students.length;
    const attendCount = record.attendees.length;
    const lateCount = record.latecomer.length;
    const earlyLeaveCount = record.early_leaver.length;
    const absentCount = studentStatus.filter(s => s.isAbsent).length;

    return (
      <div>
        <Descriptions title="课堂详情" bordered column={2}>
          <Descriptions.Item label="记录ID">{record.record_id}</Descriptions.Item>
          <Descriptions.Item label="课程ID">{record.course_id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(record.create_at).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {record.detecting ? (
              <Tag icon={<SyncOutlined spin />} color="processing">课程进行中</Tag>
            ) : (
              <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="学生总数">{totalStudents}</Descriptions.Item>
          <Descriptions.Item label="出勤人数">{attendCount}
          </Descriptions.Item>
          <Descriptions.Item label="迟到人数">{lateCount}
          </Descriptions.Item>
          <Descriptions.Item label="早退人数">{earlyLeaveCount}
          </Descriptions.Item>
          <Descriptions.Item label="缺勤人数">{absentCount}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5} style={{ marginTop: 16 }}>学生出勤情况</Title>
        <Table 
          columns={studentStatusColumns} 
          dataSource={studentStatus} 
          pagination={false} 
          size="small"
        />
      </div>
    );
  };

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
          <Space>
            {isMonitoring ? (
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                loading={monitoringLoading}
                onClick={stopMonitoring}
              >
                结束监控
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={monitoringLoading}
                onClick={startMonitoring}
              >
                开始监控
              </Button>
            )}
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              编辑课程
            </Button>
          </Space>
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
            {
              key: "3",
              label: (
                <span>
                  <HistoryOutlined />
                  课堂记录
                </span>
              ),
              children: (
                <Table
                  dataSource={courseRecords}
                  columns={recordColumns}
                  rowKey="record_id"
                  expandable={{
                    expandedRowRender,
                    rowExpandable: record => true,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: (expanded, record) => {
                      setExpandedRowKeys(expanded ? [record.record_id] : []);
                    },
                  }}
                  loading={recordsLoading}
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