"use client";

import React from "react";
import type { ReactNode } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";

// Next.js的useServerInsertedHTML函数模拟实现
function useServerInsertedHTML(callback: () => ReactNode): void {
  React.useEffect(() => {
    // 客户端执行callback并插入到DOM
    const html = callback();
    if (html && typeof window !== 'undefined') {
      // 这是一个简化的实现，实际上在客户端不需要执行这个操作
      // 因为我们只需要在服务器端渲染时注入样式
    }
  }, [callback]);
}

const StyledComponentsRegistry = ({ children }: { children: ReactNode }) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    // 避免重复插入
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
    );
  });

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: "#1890ff",
            colorSuccess: "#52c41a",
            colorWarning: "#faad14",
            colorError: "#f5222d",
            colorInfo: "#1890ff",
            borderRadius: 4,
          },
          algorithm: theme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};

export default StyledComponentsRegistry; 