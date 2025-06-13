import axios from 'axios';

// Base URLs for different servers
const MAIN_API_URL = 'http://localhost:3001';
const TEACHER_API_URL = 'http://localhost:3002';
const ADMIN_API_URL = 'http://localhost:5000';

// Create axios instances for different servers
const mainApi = axios.create({
  baseURL: MAIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const teacherApi = axios.create({
  baseURL: TEACHER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token if available
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Add auth interceptors to all API instances
addAuthInterceptor(mainApi);
addAuthInterceptor(teacherApi);
addAuthInterceptor(adminApi);

// Chat API services
export const chatService = {
  sendMessage: async (message, image = null) => {
    const formData = new FormData();
    formData.append('message', message);
    
    if (image) {
      formData.append('image', image);
    }
    
    const response = await mainApi.post('/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  sendTeacherMessage: async (message) => {
    const response = await teacherApi.post('/teacher-chat', { message });
    return JSON.parse(response.data);
  },
  
  // Add getChatHistory method
  getChatHistory: async (teacherId) => {
    try {
      const response = await teacherApi.get(`/chat-history/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return { success: false, data: [] };
    }
  },
  
  // Add getStudentInteractions method
  getStudentInteractions: async (teacherId) => {
    try {
      const response = await teacherApi.get(`/student-interactions/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student interactions:', error);
      // Return mock data as fallback
      return {
        success: true,
        data: {
          students: [],
          weeklyActivity: [],
          totalStudents: 0,
          totalMessages: 0,
          activeStudents: 0
        }
      };
    }
  },
};

// Lesson Planning API services
export const lessonPlanningService = {
  // Save a lesson plan to the database
  saveLessonPlan: async (lessonPlan) => {
    try {
      const response = await mainApi.post('/lesson-plans', lessonPlan);
      return response.data;
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      throw error;
    }
  },
  
  // Get all lesson plans for a teacher
  getTeacherLessonPlans: async (teacherId) => {
    try {
      const response = await teacherApi.get(`/lesson-plans/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
      throw error;
    }
  },
  
  // Get a specific lesson plan by ID
  getLessonPlanById: async (planId) => {
    try {
      const response = await mainApi.get(`/lesson-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson plan:', error);
      throw error;
    }
  },
  
  // Update an existing lesson plan
  updateLessonPlan: async (planId, updatedPlan) => {
    try {
      const response = await mainApi.put(`/lesson-plans/${planId}`, updatedPlan);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson plan:', error);
      throw error;
    }
  },
  
  // Delete a lesson plan
  deleteLessonPlan: async (planId) => {
    try {
      const response = await mainApi.delete(`/lesson-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lesson plan:', error);
      throw error;
    }
  },
  
  // Generate a lesson plan using Mistral AI
  generateLessonPlanWithAI: async (templateType, topicName, duration, language = 'english') => {
    try {
      const response = await teacherApi.post('/generate-lesson-plan', {
        templateType,
        topicName,
        duration,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error generating lesson plan with AI:', error);
      throw error;
    }
  },
};

// User management API services
export const userService = {
  // Get all teachers
  getAllTeachers: async () => {
    try {
      const response = await adminApi.get('/trusty/getteachers');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },
  
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await adminApi.get('/trusty/getstudents');
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  // Get all HODs
  getAllHODs: async () => {
    try {
      const response = await adminApi.get('/trusty/gethods');
      return response.data;
    } catch (error) {
      console.error('Error fetching HODs:', error);
      throw error;
    }
  },
  
  // Update teacher
  updateTeacher: async (teacherId, teacherData) => {
    try {
      const response = await adminApi.put(`/trusty/updateteacher/${teacherId}`, teacherData);
      return response.data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },
  
  // Update student
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await adminApi.put(`/trusty/updatestudent/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
};

// Analytics API services
export const analyticsService = {
  // Get student performance data
  getStudentPerformance: async (studentId) => {
    try {
      const response = await mainApi.get(`/analytics/student/${studentId}/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student performance:', error);
      throw error;
    }
  },
  
  // Get student attendance data
  getStudentAttendance: async (studentId) => {
    try {
      const response = await mainApi.get(`/analytics/student/${studentId}/attendance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      throw error;
    }
  },
  
  // Get student engagement data
  getStudentEngagement: async (studentId) => {
    try {
      const response = await mainApi.get(`/analytics/student/${studentId}/engagement`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student engagement:', error);
      throw error;
    }
  },
};

// Authentication service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await mainApi.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userId', response.data.user.id);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    
    if (token && role && id) {
      return { token, role, id };
    }
    return null;
  },
};

export default {
  chatService,
  lessonPlanningService,
  userService,
  analyticsService,
  authService,
};