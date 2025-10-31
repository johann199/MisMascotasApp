import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getApiUrl = () => {
  if (__DEV__) {
    const LOCAL_IP = '127.0.0.1';  // ← CAMBIA ESTO POR TU IP
    return `http://${LOCAL_IP}:8000/api`;
  }
  return 'https://mismascotasApp.com/api'; // no existe, este es solo un ejemplo
};

const API_URL = getApiUrl();

// instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
    }
    return Promise.reject(error);
  }
);

export default apiClient;