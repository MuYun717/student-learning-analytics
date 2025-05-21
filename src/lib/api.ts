import { Student, Course, Teacher, User, LoginResponse, CourseRecord } from "@/types";

const API_BASE_URL = "http://54.169.143.234:8080/api";
const API_OUT_SIDE_URL = "http://course-inspection.wjunzs.com:8080";

// 通用请求函数
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.statusText}`);
  }

  return response.json();
}

// 外部API请求函数
async function fetchOutAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 检查是否是FormData，如果是，则不设置Content-Type
  const isFormData = options.body instanceof FormData;
  const headers = isFormData 
    ? { ...options.headers }
    : { "Content-Type": "application/json", ...options.headers };

  const response = await fetch(`${API_OUT_SIDE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.statusText}`);
  }

  return response.json();
}

// 学生相关API
export const studentAPI = {
  getAll: () => fetchOutAPI<Student[]>("/student/list"),
  getById: (id: string) => fetchOutAPI<Student>(`/students/${id}`),
  create: (student: Partial<Student>, imageFile?: File) => {
    const formData = new FormData();
    if (student.id) formData.append("id", student.id);
    if (student.name) formData.append("name", student.name);
    if (student.class) formData.append("class", student.class);
    if (student.phoneNumber) formData.append("phone", student.phoneNumber);
    if (imageFile) formData.append("image", imageFile);
    
    return fetchOutAPI<Student>("/student/create", {
      method: "POST",
      headers: {}, // 让浏览器自动设置FormData的Content-Type
      body: formData,
    });
  },
  update: (id: string, student: Partial<Student>, imageFile?: File) => {
    const formData = new FormData();
    formData.append("id", id);
    if (student.name) formData.append("name", student.name);
    if (student.class) formData.append("class", student.class);
    if (student.phoneNumber) formData.append("phone", student.phoneNumber);
    if (imageFile) formData.append("image", imageFile);
    
    return fetchOutAPI<Student>(`/student/updateStudent`, {
      method: "POST",
      headers: {}, // 让浏览器自动设置FormData的Content-Type
      body: formData,
    });
  },
  delete: (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    
    return fetchOutAPI<void>(`/student/remove`, {
      method: "POST",
      headers: {}, // 让浏览器自动设置FormData的Content-Type
      body: formData,
    });
  },
};

// 教师相关API
export const teacherAPI = {
  getAll: () => fetchAPI<Teacher[]>("/teachers"),
  getById: (id: string) => fetchAPI<Teacher>(`/teachers/${id}`),
  create: (teacher: Omit<Teacher, "id">) =>
    fetchAPI<Teacher>("/teachers", {
      method: "POST",
      body: JSON.stringify(teacher),
    }),
  update: (name: string, teacher: Partial<Teacher>) =>
    fetchAPI<Teacher>(`/teachers/${name}`, {
      method: "PUT",
      body: JSON.stringify(teacher),
    }),
  delete: (name: string) =>
    fetchAPI<void>(`/teachers/${name}`, {
      method: "DELETE",
    }),
};

// 课程相关API
export const courseAPI = {
  getAll: () => fetchAPI<Course[]>("/courses"),
  getById: (id: string) => fetchAPI<Course>(`/courses/${id}`),
  create: (course: Omit<Course, "id">) =>
    fetchAPI<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(course),
    }),
  update: (id: string, course: Partial<Course>) =>
    fetchAPI<Course>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(course),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/courses/${id}`, {
      method: "DELETE",
    }),
};

// 认证相关API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetchAPI<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return response;
  },
  logout: () => fetchAPI<void>("/auth/logout", { method: "POST" }),
  getCurrentUser: () => fetchAPI<User>("/auth/me"),
};

// 统计相关API
export const statisticsAPI = {
  getDashboardStats: () => fetchAPI<any>("/statistics/dashboard"),
  getCourseStats: (courseId: string) => fetchAPI<any>(`/statistics/courses/${courseId}`),
  getTeacherStats: (teacherId: string) => fetchAPI<any>(`/statistics/teachers/${teacherId}`),
};

// 课程记录相关API
export const courseRecordAPI = {
  getCourseRecords: (courseId: string) => fetchOutAPI<CourseRecord[]>(`/course/queryRecords?courseID=${courseId}`),
  getRecordImages: (courseId: string, recordId: string) => fetchOutAPI<string[]>(`/course/queryOriginalImage?courseID=${courseId}&recordID=${recordId}`),
};

// 课程学生管理相关API
export const courseStudentAPI = {
  getCourseStudents: (courseId: string) => fetchOutAPI<Student[]>(`/course/queryStudents?id=${courseId}`),
  addStudentToCourse: (courseId: string, studentId: string) => {
    const formData = new FormData();
    formData.append('cid', courseId);
    formData.append('sid', studentId);
    return fetch('http://course-inspection.wjunzs.com:8080/course/addStudent', {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`添加学生请求失败: ${response.status}`);
      }
      return response;
    });
  },
  removeStudentFromCourse: (courseId: string, studentId: string) => {
    const formData = new FormData();
    formData.append('cid', courseId);
    formData.append('sid', studentId);
    return fetch('http://course-inspection.wjunzs.com:8080/course/removeStudent', {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`移除学生请求失败: ${response.status}`);
      }
      return response;
    });
  }
}; 