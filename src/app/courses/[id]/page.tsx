"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Tooltip,
  TimePicker,
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
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { courseRecordAPI, studentAPI, courseStudentAPI } from "@/lib/api";
import { CourseRecord, StudentData, Student } from "@/types";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface Teacher {
  id: string;
  name: string;
  title: string;
  department: string;
  phoneNumber: string;
}

interface CourseSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
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

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseRecords, setCourseRecords] = useState<CourseRecord[]>([]);
  const [courseStudents, setCourseStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [allStudentsLoading, setAllStudentsLoading] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [form] = Form.useForm();
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);

  // 获取课程详情
  useEffect(() => {
    if (params.id) {
      fetchCourseDetail(params.id as string);
    }
  }, [params.id]);

  // 获取课程记录数据
  useEffect(() => {
    if (params.id) {
      fetchCourseRecords(params.id as string);
      fetchCourseStudents(params.id as string);
    }
  }, [params.id]);

  // 检查课程记录中是否有正在进行的监控
  useEffect(() => {
    const hasActiveMonitoring = courseRecords?.some(record => record.detecting === true) || false;
    setIsMonitoring(hasActiveMonitoring);
  }, [courseRecords]);

  // 获取课程详情
  const fetchCourseDetail = async (courseId: string) => {
    try {
      setCourseLoading(true);
      const response = await fetch(`http://course-inspection.wjunzs.com:8080/course/queryCourseInfo?id=${courseId}`);
      if (!response.ok) {
        throw new Error('获取课程详情失败');
      }
      const data = await response.json();
      setCourse(data);
      if (data.schedule) {
        setSchedules(data.schedule);
      }
    } catch (error) {
      console.error('获取课程详情错误:', error);
      message.error('获取课程详情失败');
    } finally {
      setCourseLoading(false);
    }
  };

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

  // 获取课程学生列表
  const fetchCourseStudents = async (courseId: string) => {
    try {
      setStudentsLoading(true);
      const students = await courseStudentAPI.getCourseStudents(courseId);
      setCourseStudents(students);
    } catch (error) {
      console.error("获取课程学生列表失败:", error);
      message.error("获取课程学生列表失败");
    } finally {
      setStudentsLoading(false);
    }
  };

  // 获取所有学生列表
  const fetchAllStudents = async () => {
    try {
      setAllStudentsLoading(true);
      const students = await studentAPI.getAll();
      setAllStudents(students);
    } catch (error) {
      console.error("获取所有学生列表失败:", error);
      message.error("获取所有学生列表失败");
    } finally {
      setAllStudentsLoading(false);
    }
  };

  // 添加学生到课程
  const handleAddStudent = async () => {
    if (!course || !selectedStudentId) return;
    
    try {
      setAddingStudent(true);
      await courseStudentAPI.addStudentToCourse(course.id, selectedStudentId);
      message.success("学生添加成功");
      setIsAddStudentModalOpen(false);
      setSelectedStudentId("");
      await fetchCourseStudents(course.id);
    } catch (error) {
      console.error("添加学生失败:", error);
      message.error("添加学生失败");
    } finally {
      setAddingStudent(false);
    }
  };

  // 从课程中删除学生
  const handleRemoveStudent = async (studentId: string) => {
    if (!course) return;
    
    try {
      setRemovingStudentId(studentId);
      await courseStudentAPI.removeStudentFromCourse(course.id, studentId);
      message.success("学生移除成功");
      await fetchCourseStudents(course.id);
    } catch (error) {
      console.error("移除学生失败:", error);
      message.error("移除学生失败");
    } finally {
      setRemovingStudentId(null);
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
      name: course.name,
      teacher_id: course.teacher.id,
      teacher_name: course.teacher.name,
      teacher_title: course.teacher.title,
      teacher_department: course.teacher.department,
      teacher_phone: course.teacher.phoneNumber,
      camera_url: course.camera_url,
      detail: course.detail,
      class_room: course.class_room,
      term: course.term,
      course_date: [dayjs(course.start_date), dayjs(course.end_date)],
    });
    setIsEditModalOpen(true);
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

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 获取课程日期范围
      const { course_date, ...restValues } = values;
      const start_date = course_date[0].format('YYYY-MM-DD');
      const end_date = course_date[1].format('YYYY-MM-DD');
      
      // 构建要提交的数据
      const updatedCourse = {
        id: course.id,
        name: values.name,
        teacher: {
          id: values.teacher_id,
          name: values.teacher_name,
          title: values.teacher_title,
          department: values.teacher_department,
          phoneNumber: values.teacher_phone
        },
        schedule: schedules,
        students: course.students, // 保持原有学生列表不变
        camera_url: values.camera_url,
        detail: values.detail,
        class_room: values.class_room, 
        term: values.term,
        start_date,
        end_date
      };
      
      // 发送更新请求
      const response = await fetch('http://course-inspection.wjunzs.com:8080/course/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCourse)
      });

      if (!response.ok) {
        throw new Error('更新课程失败');
      }
      
      message.success("课程信息更新成功");
      setIsEditModalOpen(false);
      
      // 重新获取课程信息
      fetchCourseDetail(course.id);
    } catch (error) {
      console.error("更新课程失败:", error);
      message.error("更新课程失败，请检查表单");
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
      dataIndex: "id",
      key: "id",
    },
    {
      title: "班级",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "联系电话",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Student) => (
        <Button 
          type="primary" 
          danger 
          onClick={() => handleRemoveStudent(record.id)}
          loading={removingStudentId === record.id}
        >
          解绑
        </Button>
      ),
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
      title: "结束时间",
      dataIndex: "finish_at",
      key: "finish_at",
      render: (text: string) => {
        // 检查是否为默认时间值（表示未结束）
        if (!text || text === "0001-01-01T00:00:00Z") {
          return "-";
        }
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
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
        const totalStudents = record.students?.length??0;
        const attendCount = record.attendees?.length??0;
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
    {
      title: "操作",
      key: "action",
      render: (_: any, record: CourseRecord) => (
        <Button
          type="primary"
          icon={<PictureOutlined />}
          onClick={() => handleViewImages(record)}
        >
          查看截图
        </Button>
      ),
    },
  ];

  // 查看课堂截图
  const handleViewImages = (record: CourseRecord) => {
    router.push(`/courses/${params.id}/records/${record.record_id}/images?time=${record.create_at}`);
  };

  // 课堂记录展开行内容
  const expandedRowRender = (record: CourseRecord) => {
    // 计算学生出勤状态
    const studentStatus = record.students.map(student => {
      const studentId = typeof student === 'string' ? student : student.id;
      const studentName = typeof student === 'string' ? student : student.name;
      const studentInfo = typeof student === 'string' ? {} : student;
      
      // 检查学生是否在各个名单中
      const isAttend = record.attendees ? record.attendees.some(a => (typeof a === 'string' ? a : a.id) === studentId) : false;
      const isLatecomer = record.latecomer ? record.latecomer.some(l => (typeof l === 'string' ? l : l.id) === studentId) : false;
      const isEarlyLeaver = record.early_leaver ? record.early_leaver.some(e => (typeof e === 'string' ? e : e.id) === studentId) : false;
      
      // 如果学生既不在出勤、迟到和早退名单中，则标记为缺勤
      const isAbsent = !isAttend && !isLatecomer && !isEarlyLeaver;

      return {
        key: studentId,
        id: studentId,
        name: studentName,
        class: (studentInfo as StudentData)?.class || '',
        phoneNumber: (studentInfo as StudentData)?.phoneNumber || '',
        isAttend,
        isLatecomer,
        isEarlyLeaver,
        isAbsent
      };
    });

    // 学生出勤状态列
    const studentStatusColumns = [
      { 
        title: "姓名", 
        dataIndex: "name", 
        key: "name",
        render: (name: string, record: any) => (
          <Tooltip 
            title={
              <div>
                <p><strong>学号:</strong> {record.id}</p>
                <p><strong>班级:</strong> {record.class || '未设置'}</p>
                <p><strong>联系电话:</strong> {record.phoneNumber || '未设置'}</p>
              </div>
            }
          >
            <span>{name || '未知学生'}</span>
          </Tooltip>
        )
      },
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
    const attendCount = record.attendees ? record.attendees.length : 0;
    const lateCount = record.latecomer ? record.latecomer.length : 0;
    const earlyLeaveCount = record.early_leaver ? record.early_leaver.length : 0;
    const absentCount = studentStatus.filter(s => s.isAbsent).length;

    return (
      <div>
        <Descriptions title="课堂详情" bordered column={2}>
          <Descriptions.Item label="记录ID">{record.record_id}</Descriptions.Item>
          <Descriptions.Item label="课程ID">{record.course_id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(record.create_at).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="结束时间">
            {!record.finish_at || record.finish_at === "0001-01-01T00:00:00Z" 
              ? "-" 
              : dayjs(record.finish_at).format("YYYY-MM-DD HH:mm:ss")}
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

  // 计算课程状态
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
  const courseStatus = getCourseStatus(course.start_date, course.end_date);

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={2}>{course.name}</Title>
            <Text type="secondary">课程ID: {course.id}</Text>
            <Tag className="ml-4" color={getStatusColor(courseStatus)}>
              {getStatusText(courseStatus)}
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
            <Text>{course.detail}</Text>
          </div>
          <div>
            <Text strong>教室：</Text>
            <Text>{course.class_room}</Text>
          </div>
          <div>
            <Text strong>学期：</Text>
            <Text>{course.term}</Text>
          </div>
          <div>
            <Text strong>起止时间：</Text>
            <Text>{`${course.start_date} 至 ${course.end_date}`}</Text>
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
                  教师信息
                </span>
              ),
              children: (
                <div className="mt-4">
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="姓名">{course.teacher.name}</Descriptions.Item>
                    <Descriptions.Item label="职称">{course.teacher.title}</Descriptions.Item>
                    <Descriptions.Item label="院系">{course.teacher.department}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{course.teacher.phoneNumber}</Descriptions.Item>
                  </Descriptions>
                </div>
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
                <div>
                  <div className="flex justify-end mb-4">
                    <Button
                      type="primary"
                      onClick={() => {
                        fetchAllStudents();
                        setIsAddStudentModalOpen(true);
                      }}
                    >
                      添加学生
                    </Button>
                  </div>
                  <Table
                    dataSource={courseStudents as any}
                    columns={studentColumns}
                    rowKey="id"
                    loading={studentsLoading}
                  />
                </div>
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
            <Input />
          </Form.Item>

          <Form.Item
            name="term"
            label="学期"
            rules={[{ required: true, message: "请输入学期" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="course_date"
            label="起止时间"
            rules={[{ required: true, message: "请选择起止时间" }]}
          >
            <RangePicker />
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
            <Input />
          </Form.Item>

          <Form.Item
            name="detail"
            label="课程详细描述"
            rules={[{ required: true, message: "请输入课程详细描述" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加学生弹窗 */}
      <Modal
        title="添加学生"
        open={isAddStudentModalOpen}
        onOk={handleAddStudent}
        onCancel={() => setIsAddStudentModalOpen(false)}
        confirmLoading={addingStudent}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="搜索学生"
          optionFilterProp="children"
          loading={allStudentsLoading}
          value={selectedStudentId}
          onChange={(value) => setSelectedStudentId(value)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={allStudents
            .filter(student => !courseStudents.some(cs => cs.id === student.id))
            .map(student => ({
              value: student.id,
              label: `${student.name} (${student.id})${student.class ? ` - ${student.class}` : ''}`,
            }))}
        />
      </Modal>
    </div>
  );
};

export default CourseDetailPage;