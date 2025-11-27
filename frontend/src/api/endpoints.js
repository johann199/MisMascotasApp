import apiClient from './client';
import AuthService from '../services/authService';
import { API_URL } from '@env';

export const authAPI = {
  // Registro con email/password
  register: async (data) => {
    try {
      console.log('Datos enviados al backend:', data);
      const response = await apiClient.post('/auth/registrar', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en registro:', error.response?.data);
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

export const mascotasAPI = {
  // Listar todas las mascotas
  listar: async () => {
    try {
      const response = await apiClient.get('/mascotas/lista');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al obtener mascotas' 
      };
    }
  },

  // Crear mascota con imagen
  async crear(data, imagenUri) {
  try {
    const formData = new FormData();

    // Agregar campos
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Agregar imagen
    if (imagenUri) {
      const filename = imagenUri.split('/').pop();
      const ext = filename.split('.').pop();

      formData.append("imagen", {
        uri: imagenUri,
        type: `image/${ext}`,
        name: filename,
      });
    }

    const response = await apiClient.post('/mascotas/crear', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.log("Error creando mascota:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.detail || "Error creando mascota",
    };
  }
},


  // Actualizar mascota
  actualizar: async (mascotaId, mascotaData, imagenUri = null) => {
    try {
      const formData = new FormData();
      
      // Agregar solo los campos que se van a actualizar
      if (mascotaData.nombre) formData.append('nombre', mascotaData.nombre);
      if (mascotaData.raza) formData.append('raza', mascotaData.raza);
      if (mascotaData.dia) formData.append('dia', mascotaData.dia);
      if (mascotaData.descripcion) formData.append('descripcion', mascotaData.descripcion);
      if (mascotaData.tipo_reporte) formData.append('tipo_reporte', mascotaData.tipo_reporte);

      // Agregar nueva imagen si existe
      if (imagenUri) {
        const filename = imagenUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('imagen', {
          uri: imagenUri,
          name: filename,
          type: type,
        });
      }

      const response = await apiClient.put(`/mascotas/actualizar/${mascotaId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al actualizar mascota' 
      };
    }
  },

  // Eliminar mascota
  eliminar: async (mascotaId) => {
    try {
      const response = await apiClient.delete(`/mascotas/eliminar/${mascotaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al eliminar mascota' 
      };
    }
  },
};

export const serviciosAPI = {
  // Listar servicios
  listar: async () => {
    try {
      const response = await apiClient.get('/servicios/lista');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false,
        error: error.response?.data?.detail || 'Error al obtener servicios'
      };
    }
  },

  // Crear servicio con imagen
  crear: async (data, imagenUri) => {
    try {
      const formData = new FormData();

      // Campos normales
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Imagen
      if (imagenUri) {
        const filename = imagenUri.split('/').pop();
        const ext = filename.split('.').pop();

        formData.append("imagen", {
          uri: imagenUri,
          type: `image/${ext}`,
          name: filename
        });
      }

      const response = await apiClient.post('/servicios/crear', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error creando servicio:", error.response?.data || error);
      return { 
        success: false,
        error: error.response?.data?.detail || "Error creando servicio"
      };
    }
  },

  // Actualizar servicio
  actualizar: async (servicioId, data, imagenUri = null) => {
    try {
      const formData = new FormData();

      if (data.nombre) formData.append('nombre', data.nombre);
      if (data.descripcion) formData.append('descripcion', data.descripcion);
      if (data.telefono) formData.append('telefono', data.telefono);

      // Imagen opcional
      if (imagenUri) {
        const filename = imagenUri.split('/').pop();
        const ext = filename.split('.').pop();

        formData.append("imagen", {
          uri: imagenUri,
          type: `image/${ext}`,
          name: filename
        });
      }

      const response = await apiClient.put(`/servicios/actualizar/${servicioId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar servicio'
      };
    }
  },

  // Eliminar servicio
  eliminar: async (servicioId) => {
    try {
      const response = await apiClient.delete(`/servicios/eliminar/${servicioId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false,
        error: error.response?.data?.detail || 'Error al eliminar servicio'
      };
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
