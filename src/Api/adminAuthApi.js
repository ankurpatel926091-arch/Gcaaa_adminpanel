import axiosInstance, { TOKEN_KEY, ADMIN_KEY } from './axiosInstance';

export const authApi = {
  get: (url, config) => axiosInstance.get(`/admin/auth${url}`, config),
  post: (url, data, config) => axiosInstance.post(`/admin/auth${url}`, data, config),
  put: (url, data, config) => axiosInstance.put(`/admin/auth${url}`, data, config),
  delete: (url, config) => axiosInstance.delete(`/admin/auth${url}`, config),
};

export const adminAuth = {
  // Login
  login: async (email, password) => {
    const response = await authApi.post('/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(
        ADMIN_KEY,
        JSON.stringify(response.data.admin || {})
      );
    }
    return response.data;
  },

  // Register a new admin
  register: async (adminData) => {
    const response = await authApi.post('/register', adminData);
    return response.data;
  },

  // Fetch current admin profile from DB using JWT
  getMe: async () => {
    const response = await authApi.get('/me');
    if (response.data?.admin) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await authApi.put('/profile', data);
    if (response.data?.admin) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await authApi.put('/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },

  // Helper getters
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getStoredAdmin: () => {
    try {
      const data = localStorage.getItem(ADMIN_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};

export default adminAuth;
