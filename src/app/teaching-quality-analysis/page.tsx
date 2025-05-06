"use client";

import { useState } from "react";
import {
    Card,
    Select,
    DatePicker,
    Button,
    Row,
    Col,
    Statistic,
    Progress,
    Table,
    message,
    Space
} from "antd";
import {
    SearchOutlined,
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockCourses, mockTeachers, mockStudents } from "@/lib/mockData";

const { Option } = Select;
const { RangePicker } = DatePicker;

const TeachingQualityAnalysis = () => {
    const [filterType, setFilterType] = useState("class"); // class/teacher/course
    const [selectedItem, setSelectedItem] = useState("");
    const [dateRange, setDateRange] = useState<Date[]>([]);

    // 获取筛选选项
    const getFilterOptions = () => {
        switch (filterType) {
            case "class":
                return Array.from(new Set(mockStudents.map(s => s.classGroup)));
            case "teacher":
                return mockTeachers.map(t => t.name);
            case "course":
                return mockCourses.map(c => c.name);
            default:
                return [];
        }
    };

    // 模拟数据 - 出勤率
    const getAttendanceRate = () => {
        return Math.floor(Math.random() * 20) + 80; // 80-100%
    };

    // 模拟数据 - 听课率
    const getParticipationRate = () => {
        return Math.floor(Math.random() * 15) + 85; // 85-100%
    };

    // 模拟数据 - 成绩分布
    const getScoreDistribution = () => {
        return [
            { range: "90-100", count: Math.floor(Math.random() * 10) + 5 },
            { range: "80-89", count: Math.floor(Math.random() * 8) + 3 },
            { range: "70-79", count: Math.floor(Math.random() * 5) + 2 },
            { range: "60-69", count: Math.floor(Math.random() * 3) + 1 },
            { range: "<60", count: Math.floor(Math.random() * 2) },
        ];
    };

    const columns = [
        { title: "指标", dataIndex: "metric", key: "metric" },
        { title: "数值", dataIndex: "value", key: "value" },
        { title: "趋势", dataIndex: "trend", key: "trend" },
    ];

    const data = [
        {
            metric: "出勤率",
            value: `${getAttendanceRate()}%`,
            trend: "↑ 5%"
        },
        {
            metric: "听课率",
            value: `${getParticipationRate()}%`,
            trend: "↑ 3%"
        },
        {
            metric: "平均成绩",
            value: "82.5",
            trend: "→"
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">教学质量分析</h2>
                <Space>
                    <Button icon={<BarChartOutlined />}>导出报表</Button>
                </Space>
            </div>

            <Card>
                <Row gutter={16} className="mb-6">
                    <Col span={8}>
                        <Select
                            style={{ width: '100%' }}
                            value={filterType}
                            onChange={(value) => {
                                setFilterType(value);
                                setSelectedItem("");
                            }}
                        >
                            <Option value="class">按班级</Option>
                            <Option value="teacher">按教师</Option>
                            <Option value="course">按课程</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedItem}
                            onChange={setSelectedItem}
                            placeholder={`请选择${filterType === 'class' ? '班级' : filterType === 'teacher' ? '教师' : '课程'}`}
                            disabled={!filterType}
                        >
                            {getFilterOptions().map(item => (
                                <Option key={item} value={item}>{item}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker
                            style={{ width: '100%' }}
                            onChange={(dates, dateStrings) => {
                                if (dates) {
                                    // 过滤掉可能为 null 的 date，然后转换为 Date 对象
                                    setDateRange(dates.filter(date => date !== null).map(date => date.toDate()));
                                } else {
                                    setDateRange([]);
                                }
                            }}
                        />
                    </Col>
                </Row>

                {selectedItem ? (
                    <>
                        <Row gutter={16} className="mb-6">
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="出勤率"
                                        value={getAttendanceRate()}
                                        suffix="%"
                                        precision={2}
                                    />
                                    <Progress
                                        percent={getAttendanceRate()}
                                        status="active"
                                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="听课率"
                                        value={getParticipationRate()}
                                        suffix="%"
                                        precision={2}
                                    />
                                    <Progress
                                        percent={getParticipationRate()}
                                        status="active"
                                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="平均成绩"
                                        value={82.5}
                                        precision={1}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Card title="关键指标">
                                    <Table
                                        columns={columns}
                                        dataSource={data}
                                        pagination={false}
                                        bordered
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '300px',
                        color: 'rgba(0, 0, 0, 0.25)'
                    }}>
                        <BarChartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <p style={{ fontSize: '16px' }}>请选择筛选条件查看教学质量分析数据</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TeachingQualityAnalysis;