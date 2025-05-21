export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  title?: string;
  department?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId?: string;  // 可能不是必须的，因为在创建时API只需要id、name、class和phone
  email?: string;
  grade?: string;      // API中未提及
  class: string;  // 对应API中的class字段
  phoneNumber: string; // 对应API中的phone字段
  avatar?: string;     // 头像URL
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teachers: Teacher[];
  students: Student[];
  classroom: string;
  schedule: {
    dayOfWeek: number; // 0-6，0表示周日
    startTime: string; // "HH:MM"格式
    endTime: string; // "HH:MM"格式
  }[];
  term: string; // 例如："2023-春季学期"
  startDate: string; // ISO格式日期
  endDate: string; // ISO格式日期
  status: 'active' | 'completed' | 'upcoming';
  averageScore?: number;
  reports: CourseReport[];
}

export interface CourseReport {
  id: string;
  courseId: string;
  title: string;
  date: string; // ISO格式日期
  content: string;
  metrics: {
    attendance: number; // 出勤率，百分比
    participation: number; // 课堂参与度，百分比
    comprehension: number; // 理解程度，百分比
    satisfaction: number; // 满意度，百分比
  };
  studentFeedbacks: {
    studentId: string;
    score: number; // 1-5
    comment?: string;
  }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
}

export interface CourseSchedule {
  dayOfWeek: number; // 0-6，0表示周日
  startTime: string; // "HH:MM"格式
  endTime: string; // "HH:MM"格式
}

export interface StudentData {
  id: string;
  name: string;
  class?: string;
  phoneNumber?: string;
}

export interface CourseRecord {
  course_id: string;
  record_id: string;
  create_at: string;
  finish_at: string;
  teacher: string;
  students: (string | StudentData)[];
  latecomer: (string | StudentData)[] | null;
  early_leaver: (string | StudentData)[] | null;
  attendees: (string | StudentData)[];
  detecting: boolean;
}