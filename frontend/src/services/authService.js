import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/endpoints';

class AuthService {
  // Guardar token y usuario
  async saveAuthData(token, user) {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error guardando datos de autenticación:', error);
      return false;
    }
  }

  // Obtener token
  async getToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  // Obtener usuario guardado
  async getUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  // Verificar si está autenticado
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  // Registro
  async register(email, password, username, firstName = '', lastName = '') {
    const result = await authAPI.register({
      email,
      password,
      username,
      first_name: firstName,
      last_name: lastName,
    });

    if (result.success) {
      // Hacer login automático después del registro
      return await this.login(email, password);
    }

    return result;
  }

  // Login
  async login(email, password) {
    const result = await authAPI.login(email, password);

    if (result.success) {
      const { access_token, user } = result.data;
      await this.saveAuthData(access_token, user);
    }

    return result;
  }

  // Login con Google
  async loginWithGoogle(idToken, profileImage = null) {
    const result = await authAPI.googleAuth(idToken, profileImage);

    if (result.success) {
      const { access_token, user } = result.data;
      await this.saveAuthData(access_token, user);
    }

    return result;
  }

  // Logout
  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
  }

  // Actualizar perfil
  async updateProfile(data) {
    const result = await authAPI.updateProfile(data);

    if (result.success) {
      // Actualizar usuario guardado
      await AsyncStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  }

  // Refrescar usuario actual
  async refreshUser() {
    const result = await authAPI.getCurrentUser();

    if (result.success) {
      await AsyncStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  }
}

export default new AuthService();