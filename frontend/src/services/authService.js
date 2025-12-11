import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/endpoints';

class AuthService {
  listeners = [];

  subscribeAuth(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyAuthChange(state) {
    this.listeners.forEach(cb => cb(state));
  }

  async saveAuthData(token, user) {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      this.notifyAuthChange(true);
      return true;
    } catch (error) {
      console.error('Error guardando datos de autenticación:', error);
      return false;
    }
  }
  async getToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  async getUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  async register(emailOrData, password, username, firstName = '', lastName = '') {
    let registerData;

    if (typeof emailOrData === 'object') {
      registerData = emailOrData;
    } else {
      registerData = {
        email: emailOrData,
        password,
        username,
        first_name: firstName,
        last_name: lastName,
      };
    }

    const result = await authAPI.register(registerData);

    if (result.success) {
      return await this.login(registerData.email, registerData.password);
    }

    return result;
  }


  async login(email, password) {
    const result = await authAPI.login(email, password);

    if (result.success) {
      const { access_token, user } = result.data;
      await this.saveAuthData(access_token, user);
    }

    return result;
  }

  async loginWithGoogle(idToken, profileImage = null) {
    const result = await authAPI.googleAuth(idToken, profileImage);

    if (result.success) {
      const { access_token, user } = result.data;
      await this.saveAuthData(access_token, user); 
    }

    return result;
  }


  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');

      this.notifyAuthChange(false);

      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
  }


  async updateProfile(data) {
    const result = await authAPI.updateProfile(data);

    if (result.success) {
      await AsyncStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  }

  async refreshUser() {
    const result = await authAPI.getCurrentUser();

    if (result.success) {
      await AsyncStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  }
}

export default new AuthService();
