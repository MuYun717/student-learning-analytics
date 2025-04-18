import Link from "next/link";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md text-center p-8 border rounded-lg shadow-sm bg-white h-48 mb-12">
        <h2 className="text-2xl font-bold mb-2">404</h2>
        <p className="text-gray-500 mb-6">页面未找到</p>
        <Link 
          href="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 no-underline"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}