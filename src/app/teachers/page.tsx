"use client";
import { useState } from "react";
import { Table, Input, Button, Space, Modal, Form, message } from "antd";
import { SearchOutlined, PlusOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";

// 模拟教师数据
const mockTeachers = [
  { id: 1, name: "张三", age: 30, subject: "数学", email: "zhangsan@example.com" },
  { id: 2, name: "李四", age: 35, subject: "英语", email: "lisi@example.com" },
  { id: 3, name: "王五", age: 40, subject: "物理", email: "wangwu@example.com" },
];

const TeachersPage = () => {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };    

  const handleOk = () => {
    form.validateFields().then((values) => {
      setTeachers([...teachers, { id: teachers.length + 1, ...values }]);
      setIsModalVisible(false);
      message.success('教师信息添加成功');
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    const filteredTeachers = mockTeachers.filter((teacher) =>
      teacher.name.includes(value)
    );
    setTeachers(filteredTeachers);
  };

  const handleExport = () => {
    message.info('导出功能待实现');
  };

  const handleImport = () => {
    message.info('导入功能待实现');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '学科', dataIndex: 'subject', key: 'subject' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
  ];

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">教师管理</h2>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              添加教师
            </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>
              导入
            </Button>
          </Space>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Input.Search
            placeholder="搜索教师姓名"
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>
        <Table columns={columns} dataSource={teachers} rowKey="id" />
        <Modal
          title="添加教师信息"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="subject" label="学科" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default TeachersPage;