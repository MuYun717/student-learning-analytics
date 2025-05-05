"use client";

import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Form,
  message,
  Popconfirm,
  Select,
  Upload,
  UploadProps,
  Tag
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import { mockStudents } from "@/lib/mockData";
import type { Student } from "@/types";
import * as XLSX from 'xlsx';

const { Dragger } = Upload;

export default function StudentsPage() {
  const [searchText, setSearchText] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  // 修改 ref 类型定义
  const uploadRef = useRef<HTMLInputElement>(null);

  // 获取所有班级选项
  const classOptions = Array.from(
    new Set(students.map(s => s.classGroup))
  ).map(c => ({ value: c, label: c }));

  // 筛选学生
  const filteredStudents = students.filter(student => 
    (student.name.toLowerCase().includes(searchText.toLowerCase()) ||
     student.studentId.toLowerCase().includes(searchText.toLowerCase())) &&
    (classFilter === "all" || student.classGroup === classFilter)
  );

  // 下载Excel模板
  const downloadTemplate = () => {
    const templateData = [
      ['姓名', '学号', '班级', '联系电话'],
      ['张三', '2021001', '计算机2101', '13800138000'],
      ['李四', '2021002', '计算机2102', '13800138001']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "学生模板");
    XLSX.writeFile(wb, "学生导入模板.xlsx");
  };

  // 处理Excel导入
  const handleExcelImport: UploadProps['onChange'] = (info) => {
    const { file } = info;
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Student>(firstSheet);
        
        // 验证数据格式
        const validatedData = jsonData.map((item, index) => ({
          ...item,
          id: `import-${Date.now()}-${index}`,
          studentId: item.studentId?.toString() || '',
          phoneNumber: item.phoneNumber?.toString() || ''
        }));
        
        setStudents([...students, ...validatedData]);
        message.success(`成功导入 ${validatedData.length} 条学生数据`);
      } catch (error) {
        message.error('Excel文件解析失败，请检查格式');
      }
    };
    
    reader.readAsArrayBuffer(file.originFileObj as Blob);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    message.success("删除成功");
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (values.id) {
        // 编辑
        setStudents(students.map(s => 
          s.id === values.id ? { ...s, ...values } : s
        ));
        message.success("更新成功");
      } else {
        // 新增
        const newStudent = {
          ...values,
          id: `s${students.length + 1}`,
        };
        setStudents([...students, newStudent]);
        message.success("添加成功");
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "学号",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
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
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">学生管理</h2>
          <Space>
            <Button 
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
            >
              下载模板
            </Button>
            <Button 
              icon={<UploadOutlined />}
              onClick={() => uploadRef.current?.click()}
            >
              批量导入
            </Button>
            {/* <Dragger
              accept=".xlsx,.xls"
              showUploadList={false}
              onChange={handleExcelImport}
              style={{ display: 'none' }}
            >
              <input type="file" style={{ display: 'none' }} />
            </Dragger> */}
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增学生
            </Button>
          </Space>
        </div>

        <Card>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="搜索学生姓名或学号"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select
              style={{ width: 200 }}
              placeholder="筛选班级"
              value={classFilter}
              onChange={setClassFilter}
              options={[
                { value: "all", label: "全部班级" },
                ...classOptions
              ]}
            />
          </div>

          <Table 
            columns={columns}
            dataSource={filteredStudents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />

          {/* 隐藏的上传组件 */}
          {/* <Dragger
            accept=".xlsx,.xls"
            showUploadList={false}
            onChange={handleExcelImport}
            style={{ display: 'none' }}
          /> */}
        </Card>

        <Modal
          title={form.getFieldValue("id") ? "编辑学生" : "新增学生"}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: "请输入姓名" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="studentId"
              label="学号"
              rules={[{ required: true, message: "请输入学号" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="classGroup"
              label="班级"
              rules={[{ required: true, message: "请输入班级" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="联系电话"
              rules={[{ required: true, message: "请输入联系电话" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}