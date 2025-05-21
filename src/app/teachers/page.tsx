"use client";
import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Form, message, Card } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Teacher } from "@/types";
import { teacherAPI } from "@/lib/api";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // 获取教师数据
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherAPI.getAll();
      setTeachers(data);
    } catch (error) {
      message.error("获取教师数据失败");
      console.error("获取教师数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };    

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.name) {
        // 编辑
        await teacherAPI.update(values.name, values);
        message.success("更新成功");
      } else {
        // 新增
        await teacherAPI.create(values);
        message.success("添加成功");
      }
      setIsModalVisible(false);
      fetchTeachers(); // 重新获取教师列表
    } catch (error) {
      message.error("操作失败");
      console.error("操作失败:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await teacherAPI.delete(id);
      message.success("删除成功");
      fetchTeachers(); // 重新获取教师列表
    } catch (error) {
      message.error("删除失败");
      console.error("删除失败:", error);
    }
  };

  const handleEdit = (record: Teacher) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 筛选教师
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { 
      title: '姓名', 
      dataIndex: 'name', 
      key: 'name',
      sorter: (a: Teacher, b: Teacher) => a.name.localeCompare(b.name)
    },
    { 
      title: '职称', 
      dataIndex: 'title', 
      key: 'title',
      sorter: (a: Teacher, b: Teacher) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB);
      }
    },
    { 
      title: '院系', 
      dataIndex: 'department', 
      key: 'department',
      sorter: (a: Teacher, b: Teacher) => {
        const deptA = a.department || '';
        const deptB = b.department || '';
        return deptA.localeCompare(deptB);
      }
    },
    { 
      title: '邮箱', 
      dataIndex: 'email', 
      key: 'email' 
    },
    { 
      title: '联系电话', 
      dataIndex: 'phoneNumber', 
      key: 'phoneNumber' 
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Teacher) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "确定要删除这个教师吗？",
                content: "删除后无法恢复，请谨慎操作",
                okText: "确定",
                cancelText: "取消",
                onOk: () => handleDelete(record.id)
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
      <Card>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="搜索教师姓名、邮箱或院系"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            添加教师
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredTeachers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={form.getFieldValue("id") ? "编辑教师" : "添加教师"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            preserve={false}
          >
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
              name="title"
              label="职称"
              rules={[{ required: true, message: "请输入职称" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department"
              label="院系"
              rules={[{ required: true, message: "请输入院系" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: "请输入邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" }
              ]}
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
      </Card>
  );
};

export default TeachersPage;