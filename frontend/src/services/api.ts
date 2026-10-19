import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_GYM_API_HOST && import.meta.env.VITE_GYM_API_PORT
    ? `${import.meta.env.VITE_GYM_API_HOST}:${import.meta.env.VITE_GYM_API_PORT}`
    : 'http://localhost:3000');

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const workoutPlanService = {
  getAll: () => api.get('/api/workout-plans'),
  getById: (id: string) => api.get(`/api/workout-plans/${id}`),
  create: (data: any) => api.post('/api/workout-plans', data),
  update: async (id: string, data: { htmlContent: string }) => {
    const response = await api.put(`/api/workout-plans/${id}`, data);
    return response;
  },
  updateExercise: async (planId: string, data: { exerciseId: string; field: string; value: string }) => {
    const response = await api.put(`/api/workout-plans/${planId}/exercises/${data.exerciseId}`, {
      field: data.field,
      value: data.value
    });
    return response;
  },
  delete: (id: string) => api.delete(`/api/workout-plans/${id}`),
};

export const clientService = {
  getAll: () => api.get('/api/clients'),
  getById: (id: string) => api.get(`/api/clients/${id}`),
  create: (data: any) => api.post('/api/clients', data),
  update: (id: string, data: any) => api.put(`/api/clients/${id}`, data),
  delete: (id: string) => api.delete(`/api/clients/${id}`),
  getWorkoutPlans: (clientId: string) => api.get(`/api/workout-plans/client/${clientId}`),
};

export const instructorService = {
  getAll: () => api.get('/api/instructors'),
  getById: (id: string) => api.get(`/api/instructors/${id}`),
  create: (data: any) => api.post('/api/instructors', data),
  update: (id: string, data: any) => api.put(`/api/instructors/${id}`, data),
  delete: (id: string) => api.delete(`/api/instructors/${id}`),
};

export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/api/auth/login', { email, password });
  },
  register: async (data: any) => {
    return api.post('/api/auth/register', data);
  },
  getMe: async () => {
    return api.get('/api/auth/me');
  },
};

export const chatService = {
  createSession: () => api.post('/api/chat-sessions'),
  listSessions: () => api.get('/api/chat-sessions'),
  listMessages: (sessionId: string) => api.get(`/api/chat-sessions/${sessionId}/messages`),
  sendMessage: (sessionId: string, content: string) =>
    api.post(`/api/chat-sessions/${sessionId}/messages`, { content }),
};

export const dashboardService = {
  getStatistics: () => api.get('/api/dashboard/statistics'),
};

export default api; 