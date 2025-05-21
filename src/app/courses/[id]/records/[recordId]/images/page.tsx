"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  Typography, 
  Button, 
  Image, 
  Spin, 
  Empty, 
  Space, 
  Pagination,
  Slider,
  Divider,
  Descriptions,
  Alert,
  message
} from "antd";
import { ArrowLeftOutlined, ReloadOutlined, PictureOutlined } from "@ant-design/icons";
import { courseRecordAPI } from "@/lib/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const RecordImagesPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [recordTime, setRecordTime] = useState<string | null>(null);

  useEffect(() => {
    if (params.id && params.recordId) {
      fetchImages();
    }
  }, [params.id, params.recordId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const courseId = params.id as string;
      const recordId = params.recordId as string;
      
      // 获取课堂截图
      const imageUrls = await courseRecordAPI.getRecordImages(courseId, recordId);
      setImages(imageUrls);

      // 尝试从URL参数获取课堂记录时间
      const time = new URL(window.location.href).searchParams.get("time");
      setRecordTime(time);
    } catch (error) {
      console.error("获取课堂截图失败:", error);
      message.error("获取课堂截图失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    fetchImages();
  };

  // 计算分页
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentImages = images.slice(startIndex, endIndex);
  const totalImages = images.length;

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Space>
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              返回课程
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
            >
              刷新截图
            </Button>
          </Space>
          <div>
            <Text strong>每页显示:</Text>
            <Slider
              min={1}
              max={5}
              value={pageSize}
              onChange={setPageSize}
              style={{ width: 100, display: 'inline-block', marginLeft: 16 }}
            />
          </div>
        </div>

        <Descriptions title="课堂截图信息" bordered column={1}>
          <Descriptions.Item label="课程ID">{params.id}</Descriptions.Item>
          <Descriptions.Item label="记录ID">{params.recordId}</Descriptions.Item>
          {recordTime && (
            <Descriptions.Item label="记录时间">
              {dayjs(recordTime).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="截图总数">{totalImages}</Descriptions.Item>
        </Descriptions>

        <Divider />

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <div className="mt-4">加载课堂截图中...</div>
          </div>
        ) : totalImages === 0 ? (
          <Empty 
            description="暂无课堂截图" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div>
            <Alert
              message="截图提示"
              description="以下是课堂监控截图，显示了课堂实时状态。图片可能包含学生个人信息，请妥善处理。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <div className="grid grid-cols-1 gap-6">
              {currentImages.map((url, index) => (
                <div key={index} className="mb-4">
                  <div className="mb-2">
                    <Text strong>
                      <PictureOutlined /> 截图 {startIndex + index + 1} / {totalImages}
                    </Text>
                  </div>
                  <Image
                    src={url}
                    alt={`课堂截图 ${startIndex + index + 1}`}
                    style={{ maxWidth: '100%' }}
                    placeholder={
                      <div className="flex justify-center items-center" style={{ height: '300px' }}>
                        <Spin />
                      </div>
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                onChange={setCurrentPage}
                total={totalImages}
                pageSize={pageSize}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecordImagesPage; 