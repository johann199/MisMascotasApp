import AuthService from '../authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../api/endpoints';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock de authAPI
jest.mock('../../api/endpoints', () => ({
  authAPI: {
    register: jest.fn(),
    login: jest.fn(),
    googleAuth: jest.fn(),
    getCurrentUser: jest.fn(),
    updateProfile: jest.fn(),
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('saveAuthData', () => {
    it('debería guardar token y usuario correctamente', async () => {
      const token = 'test-token-123';
      const user = { id: 1, email: 'test@example.com', username: 'testuser' };

      const result = await AuthService.saveAuthData(token, user);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', token);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
      expect(result).toBe(true);
    });

    it('debería retornar false si ocurre un error', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await AuthService.saveAuthData('token', { id: 1 });

      expect(result).toBe(false);
    });

    it('debería notificar cambios de autenticación', async () => {
      const mockCallback = jest.fn();
      AuthService.subscribeAuth(mockCallback);

      await AuthService.saveAuthData('token', { id: 1 });

      expect(mockCallback).toHaveBeenCalledWith(true);
    });
  });

  describe('getToken', () => {
    it('debería obtener el token guardado', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('stored-token');

      const token = await AuthService.getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('authToken');
      expect(token).toBe('stored-token');
    });

    it('debería retornar null si hay un error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Error'));

      const token = await AuthService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    it('debería obtener y parsear el usuario guardado', async () => {
      const user = { id: 1, email: 'test@example.com' };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(user));

      const result = await AuthService.getUser();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');
      expect(result).toEqual(user);
    });

    it('debería retornar null si no hay usuario', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await AuthService.getUser();

      expect(result).toBeNull();
    });

    it('debería retornar null si hay error al parsear', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Parse error'));

      const result = await AuthService.getUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('debería retornar true si existe token', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('token-exists');

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('debería retornar false si no existe token', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    it('debería registrar usuario con objeto de datos', async () => {
      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser',
        first_name: 'John',
        last_name: 'Doe'
      };

      const loginResponse = {
        success: true,
        data: {
          access_token: 'new-token',
          user: { id: 1, ...registerData }
        }
      };

      authAPI.register.mockResolvedValueOnce({ success: true, data: {} });
      authAPI.login.mockResolvedValueOnce(loginResponse);

      const result = await AuthService.register(registerData);

      expect(authAPI.register).toHaveBeenCalledWith(registerData);
      expect(authAPI.login).toHaveBeenCalledWith(registerData.email, registerData.password);
      expect(result.success).toBe(true);
    });

    it('debería registrar usuario con parámetros separados', async () => {
      const loginResponse = {
        success: true,
        data: {
          access_token: 'new-token',
          user: { id: 1, email: 'test@example.com' }
        }
      };

      authAPI.register.mockResolvedValueOnce({ success: true });
      authAPI.login.mockResolvedValueOnce(loginResponse);

      const result = await AuthService.register(
        'test@example.com',
        'password123',
        'testuser',
        'John',
        'Doe'
      );

      expect(authAPI.register).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('debería retornar error si el registro falla', async () => {
      authAPI.register.mockResolvedValueOnce({
        success: false,
        error: 'Email ya existe'
      });

      const result = await AuthService.register({
        email: 'existing@example.com',
        password: 'pass',
        username: 'user'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email ya existe');
    });
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      const loginData = {
        success: true,
        data: {
          access_token: 'test-token',
          user: { id: 1, email: 'test@example.com' }
        }
      };

      authAPI.login.mockResolvedValueOnce(loginData);

      const result = await AuthService.login('test@example.com', 'password123');

      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token');
      expect(result.success).toBe(true);
    });

    it('debería retornar error si las credenciales son incorrectas', async () => {
      authAPI.login.mockResolvedValueOnce({
        success: false,
        error: 'Credenciales inválidas'
      });

      const result = await AuthService.login('wrong@example.com', 'wrongpass');

      expect(result.success).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('loginWithGoogle', () => {
    it('debería iniciar sesión con Google correctamente', async () => {
      const googleData = {
        success: true,
        data: {
          access_token: 'google-token',
          user: { id: 1, email: 'google@example.com' }
        }
      };

      authAPI.googleAuth.mockResolvedValueOnce(googleData);

      const result = await AuthService.loginWithGoogle('google-id-token', 'profile.jpg');

      expect(authAPI.googleAuth).toHaveBeenCalledWith('google-id-token', 'profile.jpg');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'google-token');
      expect(result.success).toBe(true);
    });

    it('debería funcionar sin imagen de perfil', async () => {
      authAPI.googleAuth.mockResolvedValueOnce({
        success: true,
        data: { access_token: 'token', user: {} }
      });

      const result = await AuthService.loginWithGoogle('id-token');

      expect(authAPI.googleAuth).toHaveBeenCalledWith('id-token', null);
      expect(result.success).toBe(true);
    });
  });

  describe('logout', () => {
    it('debería cerrar sesión correctamente', async () => {
      const mockCallback = jest.fn();
      AuthService.subscribeAuth(mockCallback);

      const result = await AuthService.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
      expect(mockCallback).toHaveBeenCalledWith(false);
      expect(result).toBe(true);
    });

    it('debería retornar false si hay un error', async () => {
      AsyncStorage.removeItem.mockRejectedValueOnce(new Error('Error'));

      const result = await AuthService.logout();

      expect(result).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('debería actualizar el perfil correctamente', async () => {
      const updatedUser = { id: 1, username: 'updated', email: 'updated@example.com' };
      authAPI.updateProfile.mockResolvedValueOnce({
        success: true,
        data: updatedUser
      });

      const result = await AuthService.updateProfile({ username: 'updated' });

      expect(authAPI.updateProfile).toHaveBeenCalledWith({ username: 'updated' });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
      expect(result.success).toBe(true);
    });

    it('debería retornar error si falla la actualización', async () => {
      authAPI.updateProfile.mockResolvedValueOnce({
        success: false,
        error: 'Error al actualizar'
      });

      const result = await AuthService.updateProfile({ username: 'fail' });

      expect(result.success).toBe(false);
    });
  });

  describe('refreshUser', () => {
    it('debería refrescar los datos del usuario', async () => {
      const currentUser = { id: 1, email: 'current@example.com' };
      authAPI.getCurrentUser.mockResolvedValueOnce({
        success: true,
        data: currentUser
      });

      const result = await AuthService.refreshUser();

      expect(authAPI.getCurrentUser).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(currentUser));
      expect(result.success).toBe(true);
    });
  });

  describe('subscribeAuth', () => {
    it('debería agregar y remover listeners correctamente', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const unsubscribe1 = AuthService.subscribeAuth(callback1);
      const unsubscribe2 = AuthService.subscribeAuth(callback2);

      AuthService.notifyAuthChange(true);
      expect(callback1).toHaveBeenCalledWith(true);
      expect(callback2).toHaveBeenCalledWith(true);

      unsubscribe1();
      callback1.mockClear();
      callback2.mockClear();

      AuthService.notifyAuthChange(false);
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith(false);

      unsubscribe2();
    });
  });
});
