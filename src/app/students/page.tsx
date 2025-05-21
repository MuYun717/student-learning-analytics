"use client";

import { useState, useRef, useEffect } from "react";
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
  Tag,
  Image
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  LoadingOutlined,
  PictureOutlined
} from "@ant-design/icons";
import type { Student } from "@/types";
import * as XLSX from 'xlsx';
import { studentAPI } from "@/lib/api";

const { Dragger } = Upload;

export default function StudentsPage() {
  const [searchText, setSearchText] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  
  // 添加表单的状态
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addUploadLoading, setAddUploadLoading] = useState(false);
  const [addImageUrl, setAddImageUrl] = useState<string>("");
  
  // 编辑表单的状态
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editUploadLoading, setEditUploadLoading] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // 获取学生数据
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getAll();
      setStudents(data);
    } catch (error) {
      message.error("获取学生数据失败");
      console.error("获取学生数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 获取所有班级选项
  const classOptions = Array.from(
    new Set(students.map(s => s.class))
  ).map(c => ({ value: c, label: c }));

  // 筛选学生
  const filteredStudents = students.filter(student => 
    (student.name.toLowerCase().includes(searchText.toLowerCase()) ||
     student.id.toLowerCase().includes(searchText.toLowerCase())) &&
    (classFilter === "all" || student.class === classFilter)
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
  const handleExcelImport: UploadProps['onChange'] = async (info) => {
    const { file } = info;
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Student>(firstSheet);
        
        // 验证数据格式
        const validatedData = jsonData.map((item: any) => ({
          ...item,
          class:item.className.toString()||'',
          phoneNumber: item.phoneNumber?.toString() || ''
        }));
        
        // 批量创建学生
        for (const student of validatedData) {
          await studentAPI.create(student);
        }
        
        message.success(`成功导入 ${validatedData.length} 条学生数据`);
        fetchStudents(); // 重新获取学生列表
      } catch (error) {
        message.error('Excel文件解析失败或导入失败，请检查格式');
        console.error('导入失败:', error);
      }
    };
    
    reader.readAsArrayBuffer(file.originFileObj as Blob);
  };

  // 打开添加表单
  const handleOpenAddModal = () => {
    addForm.resetFields();
    setAddImageFile(null);
    setAddImageUrl("");
    setIsAddModalOpen(true);
  };

  // 打开编辑表单
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    
    // 首先重置表单
    editForm.resetFields();
    
    // 设置表单值，确保表单字段名与Modal中的表单项匹配
    editForm.setFieldsValue({
      name: student.name,
      id: student.id, // 学号字段
      class: student.class,
      phoneNumber: student.phoneNumber,
      avatar: student.avatar
    });
    
    console.log("设置编辑表单数据:", student); // 调试日志
    
    // 清空临时图片状态
    setEditImageFile(null);
    setEditImageUrl("");
    
    // 打开模态框
    setIsEditModalOpen(true);
  };

  // 处理删除学生
  const handleDelete = async (id: string) => {
    try {
      await studentAPI.delete(id);
      message.success("删除成功");
      fetchStudents(); // 重新获取学生列表
    } catch (error) {
      message.error("删除失败");
      console.error("删除失败:", error);
    }
  };

  // 添加学生提交
  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      
      // 创建学生（使用学号作为ID）
      await studentAPI.create({
        id: values.id, // 这里的ID就是学号
        name: values.name,
        class: values.class,
        phoneNumber: values.phoneNumber
      }, addImageFile || undefined);
      
      message.success("添加成功");
      setIsAddModalOpen(false);
      fetchStudents(); // 重新获取学生列表
    } catch (error) {
      message.error("添加失败");
      console.error("添加失败:", error);
    }
  };

  // 编辑学生提交
  const handleEditSubmit = async () => {
    try {
      if (!editingStudent) {
        message.error("编辑信息丢失");
        return;
      }
      
      const values = await editForm.validateFields();
      
      // 更新学生（ID不变，只更新其他字段）
      await studentAPI.update(editingStudent.id, {
        name: values.name,
        class: values.class,
        phoneNumber: values.phoneNumber
      }, editImageFile || undefined);
      
      message.success("更新成功");
      setIsEditModalOpen(false);
      fetchStudents(); // 重新获取学生列表
    } catch (error) {
      message.error("更新失败");
      console.error("更新失败:", error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        avatar ? 
        <Image src={avatar} alt="头像" width={40} height={40} style={{borderRadius: '50%'}} /> :
        <PictureOutlined style={{fontSize: 24}} />
      )
    },
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
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个学生吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 添加表单的图片上传前检查
  const beforeAddUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
      return Upload.LIST_IGNORE;
    }
    setAddImageFile(file);
    return false;
  };

  // 编辑表单的图片上传前检查
  const beforeEditUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
      return Upload.LIST_IGNORE;
    }
    setEditImageFile(file);
    return false;
  };

  // 添加表单的图片变更处理
  const handleAddImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setAddUploadLoading(true);
      return;
    }
    if (info.file.originFileObj) {
      setAddUploadLoading(false);
      // 预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        setAddImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // 编辑表单的图片变更处理
  const handleEditImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setEditUploadLoading(true);
      return;
    }
    if (info.file.originFileObj) {
      setEditUploadLoading(false);
      // 预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const addUploadButton = (
    <div>
      {addUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  const editUploadButton = (
    <div>
      {editUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>更换头像</div>
    </div>
  );

  return (
      <Card>
        <div className="flex justify-between mb-4">
          <Space>
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
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAddModal}
            >
              添加学生
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
            >
              下载模板
            </Button>
            <Upload
              accept=".xlsx,.xls"
              showUploadList={false}
              onChange={handleExcelImport}
            >
              <Button icon={<UploadOutlined />}>导入Excel</Button>
            </Upload>
          </Space>
        </div>

        <Table 
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        {/* 添加学生模态框 */}
        <Modal
          title="添加学生"
          open={isAddModalOpen}
          onOk={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          destroyOnClose
        >
          <Form
            form={addForm}
            layout="vertical"
            preserve={false}
          >
            <Form.Item
              label="学生头像"
              name="imageUpload"
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeAddUpload}
                onChange={handleAddImageChange}
              >
                {addImageUrl ? (
                  <img src={addImageUrl} alt="头像" style={{ width: '100%' }} />
                ) : (
                  addUploadButton
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: "请输入姓名" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="id"
              label="学号"
              rules={[{ required: true, message: "请输入学号" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="class"
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

        {/* 编辑学生模态框 */}
        <Modal
          title="编辑学生"
          open={isEditModalOpen}
          onOk={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          destroyOnClose={false}
        >
          <Form
            form={editForm}
            layout="vertical"
            preserve={true}
          >
            <Form.Item
              label="学生头像"
              name="imageUpload"
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeEditUpload}
                onChange={handleEditImageChange}
              >
                {editImageUrl ? (
                  <img src={editImageUrl} alt="头像" style={{ width: '100%' }} />
                ) : editingStudent?.avatar ? (
                  <img src={editingStudent.avatar} alt="头像" style={{ width: '100%' }} />
                ) : (
                  editUploadButton
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: "请输入姓名" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="id"
              label="学号"
              rules={[{ required: true, message: "请输入学号" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="class"
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
      </Card>
  );
}