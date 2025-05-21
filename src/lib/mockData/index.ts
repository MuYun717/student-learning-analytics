import { Course, Student, Teacher, User, CourseReport } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "管理员",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
  },
  {
    id: "2",
    name: "李教授",
    email: "teacher1@example.com",
    role: "teacher",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: "3",
    name: "王同学",
    email: "student1@example.com",
    role: "student",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=3",
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "李教授",
    email: "teacher1@example.com",
    title: "副教授",
    department: "计算机科学系",
    phoneNumber: "13800138001",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: "2",
    name: "张老师",
    email: "teacher2@example.com",
    title: "讲师",
    department: "计算机科学系",
    phoneNumber: "13800138002",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=4",
  },
  {
    id: "3",
    name: "刘教授",
    email: "teacher3@example.com",
    title: "教授",
    department: "数学系",
    phoneNumber: "13800138003",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=5",
  },
];

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "王同学",
    studentId: "20210101",
    email: "student1@example.com",
    grade: "2021",
    class: "计算机2班",
    phoneNumber: "13900139001",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=3",
  },
  {
    id: "2",
    name: "赵同学",
    studentId: "20210102",
    email: "student2@example.com",
    grade: "2021",
    class: "计算机2班",
    phoneNumber: "13900139002",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6",
  },
  {
    id: "3",
    name: "陈同学",
    studentId: "20210103",
    email: "student3@example.com",
    grade: "2021",
    class: "计算机1班",
    phoneNumber: "13900139003",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=7",
  },
  {
    id: "4",
    name: "周同学",
    studentId: "20210104",
    email: "student4@example.com",
    grade: "2021",
    class: "计算机1班",
    phoneNumber: "13900139004",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=8",
  },
  {
    id: "5",
    name: "吴同学",
    studentId: "20210105",
    email: "student5@example.com",
    grade: "2021",
    class: "计算机2班",
    phoneNumber: "13900139005",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=9",
  },
];

const createMockReports = (courseId: string): CourseReport[] => {
  return [
    {
      id: `${courseId}-report-1`,
      courseId,
      title: "第一次课堂报告",
      date: "2023-03-10",
      content: "本次课程学生整体表现良好，课堂参与度高，理解度良好。",
      metrics: {
        attendance: 95,
        participation: 85,
        comprehension: 78,
        satisfaction: 90,
      },
      studentFeedbacks: [
        { studentId: "1", score: 4, comment: "讲解清晰，很容易理解" },
        { studentId: "2", score: 5, comment: "老师讲得很好" },
        { studentId: "3", score: 4 },
      ],
    },
    {
      id: `${courseId}-report-2`,
      courseId,
      title: "第二次课堂报告",
      date: "2023-03-17",
      content: "本次课程讲解了一些难点内容，学生理解度有所下降，需要进一步加强。",
      metrics: {
        attendance: 90,
        participation: 75,
        comprehension: 65,
        satisfaction: 80,
      },
      studentFeedbacks: [
        { studentId: "1", score: 3, comment: "内容有点难" },
        { studentId: "2", score: 4, comment: "希望能有更多的例子" },
        { studentId: "3", score: 3, comment: "有些地方不太明白" },
      ],
    },
  ];
};

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "数据结构与算法",
    code: "CS101",
    description: "介绍基本的数据结构和算法设计方法，包括数组、链表、树、图等数据结构和排序、搜索等算法。",
    teachers: [mockTeachers[0], mockTeachers[1]],
    students: mockStudents.slice(0, 3),
    classroom: "理工楼A101",
    schedule: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "09:40" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "11:40" },
    ],
    term: "2023-春季学期",
    startDate: "2023-03-01",
    endDate: "2023-07-01",
    status: "active",
    averageScore: 86.5,
    reports: createMockReports("1"),
  },
  {
    id: "2",
    name: "高等数学",
    code: "MATH101",
    description: "本课程覆盖微积分、线性代数等高等数学基础内容，为学生提供扎实的数学基础。",
    teachers: [mockTeachers[2]],
    students: mockStudents.slice(2, 5),
    classroom: "理工楼B203",
    schedule: [
      { dayOfWeek: 2, startTime: "08:00", endTime: "09:40" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "11:40" },
    ],
    term: "2023-春季学期",
    startDate: "2023-03-01",
    endDate: "2023-07-01",
    status: "active",
    averageScore: 79.8,
    reports: createMockReports("2"),
  },
  {
    id: "3",
    name: "计算机网络",
    code: "CS201",
    description: "本课程介绍计算机网络的基本原理和协议，包括TCP/IP协议栈、网络安全等内容。",
    teachers: [mockTeachers[0]],
    students: mockStudents,
    classroom: "理工楼A301",
    schedule: [
      { dayOfWeek: 1, startTime: "14:00", endTime: "15:40" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "09:40" },
    ],
    term: "2023-春季学期",
    startDate: "2023-03-01",
    endDate: "2023-07-01",
    status: "active",
    averageScore: 82.3,
    reports: createMockReports("3"),
  },
  {
    id: "4",
    name: "数据库系统",
    code: "CS202",
    description: "本课程介绍数据库系统的基本概念和设计方法，包括关系模型、SQL语言、数据库设计等内容。",
    teachers: [mockTeachers[1]],
    students: mockStudents.slice(1, 4),
    classroom: "理工楼B101",
    schedule: [
      { dayOfWeek: 2, startTime: "14:00", endTime: "15:40" },
      { dayOfWeek: 4, startTime: "14:00", endTime: "15:40" },
    ],
    term: "2023-春季学期",
    startDate: "2023-03-01",
    endDate: "2023-07-01",
    status: "upcoming",
    reports: [],
  },
  {
    id: "5",
    name: "软件工程",
    code: "CS301",
    description: "本课程介绍软件开发过程中的各种方法和技术，包括需求分析、系统设计、测试等内容。",
    teachers: [mockTeachers[1], mockTeachers[2]],
    students: mockStudents.slice(0, 5),
    classroom: "理工楼A201",
    schedule: [
      { dayOfWeek: 3, startTime: "14:00", endTime: "15:40" },
      { dayOfWeek: 5, startTime: "14:00", endTime: "15:40" },
    ],
    term: "2023-春季学期",
    startDate: "2023-03-01",
    endDate: "2023-07-01",
    status: "completed",
    averageScore: 88.7,
    reports: createMockReports("5"),
  },
];

export const loginMock = (credentials: { email: string; password: string }) => {
  // 在实际应用中，这里会连接后端API进行身份验证
  // 这里仅做模拟，任何用户名密码都返回管理员账号
  return Promise.resolve({
    user: mockUsers[0],
    token: "mock-jwt-token"
  });
};

export const getStatistics = () => {
  return {
    totalCourses: mockCourses.length,
    activeCourses: mockCourses.filter(c => c.status === 'active').length,
    totalStudents: mockStudents.length,
    totalTeachers: mockTeachers.length,
    averageCourseScore: mockCourses.reduce((acc, curr) => {
      return curr.averageScore ? acc + curr.averageScore : acc;
    }, 0) / mockCourses.filter(c => c.averageScore).length,
    courseAttendanceRate: 92.5,
    courseParticipationRate: 85.3,
    weeklyStats: [
      { week: '第1周', attendance: 95, participation: 90, comprehension: 85 },
      { week: '第2周', attendance: 92, participation: 88, comprehension: 82 },
      { week: '第3周', attendance: 94, participation: 86, comprehension: 80 },
      { week: '第4周', attendance: 90, participation: 85, comprehension: 78 },
      { week: '第5周', attendance: 93, participation: 87, comprehension: 83 },
      { week: '第6周', attendance: 91, participation: 84, comprehension: 79 },
    ],
  };
}; 