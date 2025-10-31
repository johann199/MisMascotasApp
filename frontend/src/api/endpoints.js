import apiClient from './client';


export const authAPI = {
  // Registro con email/password
  register: async (data) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al registrar usuario' 
      };
    }
  },

  // Login con email/password
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Credenciales inválidas' 
      };
    }
  },

  // Autenticación con Google
  googleAuth: async (idToken, profileImage = null) => {
    try {
      const response = await apiClient.post('/auth/google-auth', {
        id_token: idToken,
        profile_image: profileImage,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al autenticar con Google' 
      };
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al obtener usuario' 
      };
    }
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    try {
      const response = await apiClient.patch('/auth/me', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al actualizar perfil' 
      };
    }
  },

  // Verificar disponibilidad de email
  checkEmail: async (email) => {
    try {
      const response = await apiClient.get(`/auth/check-email/${email}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Error al verificar email' };
    }
  },

  // Verificar disponibilidad de username
  checkUsername: async (username) => {
    try {
      const response = await apiClient.get(`/auth/check-username/${username}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Error al verificar username' };
    }
  },
};


export const healthAPI = {
  check: async () => {
    try {
      const response = await apiClient.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'API no disponible' };
    }
  },
};
