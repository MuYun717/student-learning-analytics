"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Divider, message } from "antd";
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
      console.log("用户已登录，正在跳转到首页:", user);
      router.push("/");
    }
  }, [user, router]);

  // 监听错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const onFinish = async (values: { email: string; password: string }) => {
    if (!agreementChecked) {
      message.warning("请先同意用户协议");
      return;
    }

    try {
      setLoading(true);
      await login(values.email, values.password);
      // 登录后会通过 useEffect 监听 user 变化来进行跳转
    } catch (err) {
      console.error("登录错误:", err);
      message.error("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ReadOutlined className="text-4xl text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            学生学习分析系统
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请登录您的账号
          </p>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          className="mt-8 space-y-6"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码长度不能小于6位" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-between">
              <Checkbox
                checked={agreementChecked}
                onChange={e => setAgreementChecked(e.target.checked)}
              >
                我已阅读并同意
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  用户协议
                </a>
                和
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  隐私政策
                </a>
              </Checkbox>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>其他登录方式</Divider>

        <div className="flex justify-center space-x-4">
          <Button icon={<ReadOutlined />} disabled>
            统一身份认证
          </Button>
        </div>
      </div>
    </div>
  );
}