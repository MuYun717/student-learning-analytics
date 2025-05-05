export interface Teacher {
  id: string;
  name: string;
  title: string;
  department: string;
  phoneNumber: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email?: string;
  grade: string;
  classGroup: string;
  phoneNumber: string;
  avatar?: string;
}

export interface CourseSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "active" | "completed" | "upcoming";
  classroom: string;
  startDate: string;
  endDate: string;
  term: string;
  teachers: Teacher[];
  students: Student[];
  schedule: CourseSchedule[];
}

export const mockTeachers: Teacher[] = [
  {
    id: "t1",
    name: "张教授",
    title: "教授",
    department: "计算机科学系",
    phoneNumber: "13800138001",
  },
  {
    id: "t2",
    name: "李副教授",
    title: "副教授",
    department: "计算机科学系",
    phoneNumber: "13800138002",
  },
  {
    id: "t3",
    name: "王讲师",
    title: "讲师",
    department: "计算机科学系",
    phoneNumber: "13800138003",
  },
];

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "张三",
    studentId: "2021001",
    email: "s1@example.com",
    grade: "大一",
    classGroup: "计算机2101",
    phoneNumber: "13900139001",
  },
  {
    id: "s2",
    name: "李四",
    studentId: "2021002",
    email: "s2@example.com",
    grade: "大一",
    classGroup: "计算机2101",
    phoneNumber: "13900139002",
  },
  {
    id: "s3",
    name: "王五",
    studentId: "2021003",
    email: "s3@example.com",
    grade: "大一",
    classGroup: "计算机2102",
    phoneNumber: "13900139003",
  },
];

export const mockCourses: Course[] = [
  {
    id: "c1",
    code: "CS101",
    name: "计算机导论",
    description: "本课程介绍计算机科学的基本概念和原理，包括计算机系统组成、程序设计基础等内容。",
    status: "active",
    classroom: "教学楼A-101",
    startDate: "2024-03-01",
    endDate: "2024-07-01",
    term: "2024春季学期",
    teachers: [mockTeachers[0]],
    students: mockStudents.slice(0, 2),
    schedule: [
      {
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "09:40",
      },
      {
        dayOfWeek: 3,
        startTime: "10:00",
        endTime: "11:40",
      },
    ],
  },
  {
    id: "c2",
    code: "CS102",
    name: "数据结构",
    description: "本课程介绍基本数据结构和算法，包括数组、链表、树、图等数据结构的原理和实现。",
    status: "upcoming",
    classroom: "教学楼B-202",
    startDate: "2024-03-15",
    endDate: "2024-07-15",
    term: "2024春季学期",
    teachers: [mockTeachers[1]],
    students: mockStudents.slice(1, 3),
    schedule: [
      {
        dayOfWeek: 2,
        startTime: "14:00",
        endTime: "15:40",
      },
      {
        dayOfWeek: 4,
        startTime: "16:00",
        endTime: "17:40",
      },
    ],
  },
  {
    id: "c3",
    code: "CS103",
    name: "操作系统",
    description: "本课程介绍操作系统的基本概念、原理和实现技术，包括进程管理、内存管理、文件系统等内容。",
    status: "completed",
    classroom: "教学楼C-303",
    startDate: "2024-02-01",
    endDate: "2024-06-01",
    term: "2024春季学期",
    teachers: [mockTeachers[2]],
    students: mockStudents,
    schedule: [
      {
        dayOfWeek: 1,
        startTime: "14:00",
        endTime: "15:40",
      },
      {
        dayOfWeek: 3,
        startTime: "16:00",
        endTime: "17:40",
      },
    ],
  },
];

export const getStatistics = (): {
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  upcomingCourses: number;
  completedCourses: number;
} => {
  return {
    totalCourses: mockCourses.length,
    totalStudents: mockStudents.length,
    totalTeachers: mockTeachers.length,
    activeCourses: mockCourses.filter(course => course.status === 'active').length,
    upcomingCourses: mockCourses.filter(course => course.status === 'upcoming').length,
    completedCourses: mockCourses.filter(course => course.status === 'completed').length,
  };
};

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    name: string;
  };
  message?: string;
}

export const loginMock = (credentials: { email: string; password: string }): LoginResponse => {
  // 简单的模拟登录逻辑
  if (credentials.email === 'admin@example.com') {
    return {
      success: true,
      user: {
        id: '1',
        email: 'admin@example.com',
        role: 'admin',
        name: '管理员',
      },
    };
  }
  return {
    success: false,
    message: '用户名或密码错误',
  };
};