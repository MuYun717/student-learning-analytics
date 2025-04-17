"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Divider } from "antd";
import { UserOutlined, LockOutlined, ReadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, user, error } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [form] = Form.useForm();

  // 监听用户状态变化，登录成功后跳转
  useEffect(() => {
    if (user) {
      console.log("User logged in, redirecting to home page:", user);
      router.push("/");
    }
  }, [user, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      // 直接调用 login 函数，不使用 await，因为它不是异步的
      login(values.email, values.password);
      // 登录后会通过 useEffect 监听 user 变化来进行跳转
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex h-full">
      {/* 左侧品牌区域 */}
      <div className="hidden md:block md:w-[45%] bg-gradient-to-br from-blue-400 to-blue-700">
        <div className="flex justify-center items-center h-full p-10 ">
          <div className="max-w-md text-white">
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <ReadOutlined className="text-white text-2xl mr-4" />
                <h1 className="text-2xl font-bold">学生课堂学习质量分析系统</h1>
              </div>
              <p className="text-lg opacity-90">智能分析 · 全面评估 · 精准洞察</p>
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-medium mb-4">全面提升教育质量</h2>
              <p className="text-base opacity-80 mb-6">
                通过智能分析课堂数据，帮助教师了解学生学习情况，优化教学内容和方法，
                实现教育资源的最优配置，提高教学质量和学生满意度。
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold mb-2">98%</span>
                  <span className="text-sm opacity-80">学生学习体验提升</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold mb-2">87%</span>
                  <span className="text-sm opacity-80">问题解决效率提高</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold mb-2">76%</span>
                  <span className="text-sm opacity-80">教学效果提升率</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold mb-2">50+</span>
                  <span className="text-sm opacity-80">教育机构合作伙伴</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm opacity-70 mt-16">
              © 2025 浙江科技大学·应谢吾 版权所有
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧登录表单区域 */}
      <div className="w-full md:w-[55%] flex justify-center items-center bg-white overflow-y-auto">
        <div className="w-full max-w-[400px] px-6 py-12">
          <div className="block md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">学生课堂学习质量分析系统</h1>
            <p className="text-base text-gray-600">智能分析 · 全面评估 · 精准洞察</p>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-800">欢迎登录</h2>
            <p className="mt-2 text-sm text-gray-500">请使用您的账号和密码登录系统</p>
          </div>

          <Form
            name="login"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="w-full"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "请输入邮箱!" }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="请输入邮箱"
                autoComplete="email" 
                className="h-11 rounded"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
              className="mb-3"
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="h-11 rounded"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <div className="flex justify-between">
                <Checkbox 
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                >
                  <span className="text-sm">记住我</span>
                </Checkbox>
                <a className="text-primary hover:text-primary-light text-sm">忘记密码?</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!agreementChecked}
                loading={loading}
                className="w-full h-11 rounded"
              >
                登录
              </Button>
            </Form.Item>

            <div className="mt-4">
              <Checkbox 
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
              >
                <span className="text-xs text-gray-500">
                  我已阅读并同意 
                  <a className="text-primary hover:text-primary-light"> 服务条款 </a>
                  和 
                  <a className="text-primary hover:text-primary-light"> 隐私政策</a>
                </span>
              </Checkbox>
            </div>
          </Form>

          <Divider plain className="mt-8 mb-6">测试账号</Divider>
          
          <div className="text-center text-gray-500 text-sm">
            <p>测试账号: admin@example.com</p>
            <p>密码: 任意</p>
          </div>
          
          <div className="md:hidden mt-12 text-center text-gray-400 text-xs">
            <p>© 2023 学生课堂学习质量分析系统 版权所有</p>
          </div>
        </div>
      </div>
    </div>
  );
}